const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Display products
router.get('/', async (req, res) => {
    const products = await Product.find();
    res.render('products', { products });
});

module.exports = router;
