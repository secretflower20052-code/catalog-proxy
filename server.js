const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Fetch catalog items
app.get('/catalog', async (req, res) => {
    try {
        const limit = req.query.limit || 30;
        const cursor = req.query.cursor || '';
        const keyword = req.query.keyword || '';
        const creatorName = req.query.creatorName || '';
        const Category = req.query.Category || '3';
        const Subcategory = req.query.Subcategory || '';
        const SortType = req.query.SortType || '0';

        const params = {
            Category,
            Limit: limit,
            SortType,
        };

        if (Subcategory !== '') params.Subcategory = Subcategory;
        if (cursor !== '') params.Cursor = cursor;
        if (keyword !== '') params.keyword = keyword;
        if (creatorName !== '') params.creatorName = creatorName;

        const response = await axios.get(
            'https://catalog.roblox.com/v1/search/items/details',
            { params }
        );

        res.json(response.data);
    } catch (error) {
        console.error(error?.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch catalog' });
    }
});

// Fetch item thumbnail
app.get('/thumbnail/:itemId', async (req, res) => {
    try {
        const itemId = req.params.itemId;

        const response = await axios.get(
            'https://thumbnails.roblox.com/v1/assets', {
            params: {
                assetIds: itemId,
                size: '150x150',
                format: 'Png'
            }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch thumbnail' });
    }
});

// Fetch single item details
app.get('/item/:itemId', async (req, res) => {
    try {
        const itemId = req.params.itemId;

        const response = await axios.get(
            `https://economy.roblox.com/v2/assets/${itemId}/details`
        );

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch item' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Catalog proxy running on port ${PORT}`);

});
