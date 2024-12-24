const express = require("express");
const router = express.Router();

// Import Models
const Product = require("../models/Products");
const Category = require("../models/Category");

// Admin Dashboard
router.get("/", (req, res) => {
  res.render("admin/dashboard", { title: "Admin Dashboard" });
});

// CRUD for Products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.render("admin/products", { products });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.post("/products", async (req, res) => {
  try {
    await Product.create(req.body);
    res.redirect("/admin/products");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to add product.");
  }
});

// CRUD for Categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.render("admin/categories", { categories });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.post("/categories", async (req, res) => {
  try {
    await Category.create(req.body);
    res.redirect("/admin/categories");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to add category.");
  }
});

module.exports = router;
