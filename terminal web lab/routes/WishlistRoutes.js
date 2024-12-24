
const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const { ensureAuthenticated } = require('../middleware/auth');

// Add to wishlist
router.post('/add', ensureAuthenticated, async (req, res) => {
    const { productId } = req.body;
    try {
        const itemExists = await Wishlist.findOne({ userId: req.user.id, productId });
        if (!itemExists) {
            const item = new Wishlist({ userId: req.user.id, productId });
            await item.save();
            req.flash('success_msg', 'Item added to wishlist');
        } else {
            req.flash('error_msg', 'Item already in wishlist');
        }
        res.redirect('/products');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Could not add item to wishlist');
        res.redirect('/products');
    }
});

// View wishlist
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const wishlist = await Wishlist.find({ userId: req.user.id }).populate('productId');
        res.render('wishlist', { wishlist });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Could not load wishlist');
        res.redirect('/products');
    }
});

module.exports = router;
