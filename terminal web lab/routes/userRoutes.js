const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

// Register
router.get('/register', (req, res) => res.render('register'));
router.post('/register', async (req, res) => {
    const { name, email, password, password2 } = req.body;
    if (password !== password2) return res.redirect('/users/register');
    try {
        const newUser = new User({ name, email, password });
        await newUser.save();
        req.flash('success_msg', 'You are now registered and can log in');
        res.redirect('/users/login');
    } catch (err) {
        console.error(err);
    }
});

// Login
router.get('/login', (req, res) => res.render('login'));
router.post('/login', passport.authenticate('local', {
    successRedirect: '/products',
    failureRedirect: '/users/login',
    failureFlash: true,
}));

// Logout
router.get('/logout', (req, res) => {
    req.logout(() => res.redirect('/users/login'));
});

module.exports = router;
