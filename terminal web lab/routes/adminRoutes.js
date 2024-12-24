const express = require("express");
const { restrictToAdmin } = require("../middlewares/auth");
const Product = require("../models/Products");
const Category = require("../models/Category");

const adminRouter = express.Router();

// Middleware to restrict access to admins
adminRouter.use(restrictToAdmin);

// Admin Dashboard
adminRouter.get("/dashboard", (req, res) => {
  res.render("admin/dashboard", { pageTitle: "Admin Dashboard" });
});

// Controller to add item to a specific category with flash messages
adminRouter.post("/category/add", async (req, res) => {
  try {
    const { itemId, categoryId } = req.body;

    let WishlistItem = await Cart.findOne({ itemId, category: categoryId });

    if (WishlistItem) {
      WishlistItemItem.quantity += 1;
      await WishlistItem.save();
      req.flash('success', 'Item quantity updated.');
    } else {
      wishlistItem = await Wishlist.create({ itemId, category: categoryId });
      req.flash('success', 'Item added to Wishlist.');
    }

    const WishlistCount = await Wishlist.countDocuments();
    res.json({ WishlistItemCount });

  } catch (err) {
    console.error("Error adding to Wishlist:", err);
    req.flash('error', 'Failed to add to Wishlist.');
    res.status(500).json({ error: "Failed to add to Wishlist." });
  }
});


// Manage Products

// List all products
adminRouter.get("/products", async (req, res) => {
  // return res.send("admin products")
  let page = req.query.page ? Number(req.query.page) : 1;
  let pageSize = 5;

  // Get search, filter, and sort parameters
  let searchQuery = req.query.search || "";
  let sortField = req.query.sort || "name"; // Default sorting field
  let sortOrder = req.query.order === "desc" ? -1 : 1; // Ascending or descending
  let priceFilter = req.query.price || ""; // Optional price filter

  // Build the filter object for MongoDB
  let filter = {};
  if (searchQuery.trim()) {
    filter.name = { $regex: searchQuery, $options: "i" }; // Case-insensitive search
  }
  if (priceFilter) {
    filter.price = { $lte: Number(priceFilter) }; // Filter by price (less than or equal to)
  }

  // Count total records
  let totalRecords = await Product.countDocuments(filter);
  let totalPages = Math.ceil(totalRecords / pageSize);

  // Handle out-of-bounds pages
  if (page > totalPages) page = totalPages;
  if (page < 1) page = 1;

  // Fetch filtered, sorted, and paginated products
  let products = await Product.find(filter)
    .sort({ [sortField]: sortOrder }) // Dynamic sorting
    .limit(pageSize)
    .skip((page - 1) * pageSize);

  // Render products page
  return res.render("admin/products", {
    pageTitle: "Manage Your Products",
    products,
    page,
    pageSize,
    totalPages,
    totalRecords,
    searchQuery,
    sortField,
    sortOrder: req.query.order || "asc",
    priceFilter,
  });
});

// Add a new product
adminRouter.post("/products", async (req, res) => {
  try {
    await Product.create(req.body);
    res.redirect("/admin/products");
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).render("admin/error", { message: "Failed to add product." });
  }
});

// Edit a product
adminRouter.get("/products/edit/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).render("admin/error", { message: "Product not found." });
    }
    res.render("admin/editProduct", { pageTitle: "Edit Product", product });
  } catch (err) {
    console.error("Error fetching product details:", err);
    res.status(500).render("admin/error", { message: "Failed to fetch product details." });
  }
});

// Update a product
adminRouter.post("/products/edit/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).render("admin/error", { message: "Product not found." });
    }
    res.redirect("/admin/products");
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).render("admin/error", { message: "Failed to update product." });
  }
});

// Delete a product
adminRouter.post("/products/delete/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).render("admin/error", { message: "Product not found." });
    }
    res.redirect("back");
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).render("admin/error", { message: "Failed to delete product." });
  }
});

// Manage category

// List all category
adminRouter.get("/category", async (req, res) => {
  try {
    const category = await Category.find();
    res.render("admin/category", { category });
  } catch (err) {
    console.error("Error fetching category:", err);
    res.status(500).render("admin/error", { message: "Failed to load category." });
  }
});

// Add a new category
adminRouter.post("/category", async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).render("admin/error", { message: "Category title is required." });
    }
    await Category.create({ title });
    res.redirect("/admin/category");
  } catch (err) {
    console.error("Error adding category:", err);
    res.status(500).render("admin/error", { message: "Failed to add category." });
  }
});

// Edit a category
adminRouter.get("/category/edit/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).render("admin/error", { message: "Category not found." });
    }
    res.render("admin/editCategory", { pageTitle: "Edit Category", category });
  } catch (err) {
    console.error("Error fetching category details:", err);
    res.status(500).render("admin/error", { message: "Failed to fetch category details." });
  }
});

// Update a category
adminRouter.post("/category/edit/:id", async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCategory) {
      return res.status(404).render("admin/error", { message: "Category not found." });
    }
    res.redirect("/admin/category");
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).render("admin/error", { message: "Failed to update category." });
  }
});

// Delete a category
adminRouter.get("/category/delete/:id", async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).render("admin/error", { message: "Category not found." });
    }
    res.redirect("back");
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).render("admin/error", { message: "Failed to delete category." });
  }
});

module.exports = adminRouter;
