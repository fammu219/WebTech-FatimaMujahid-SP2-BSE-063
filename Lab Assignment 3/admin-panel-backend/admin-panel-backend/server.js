const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");
const connectDB = require("./config/dbConnections");
const expressLayouts = require("express-ejs-layouts");

// Load Environment Variables
dotenv.config();

// Connect to Database
connectDB();

// Initialize Express App
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true })); // Parse incoming form data
app.use(express.static(path.join(__dirname, "public"))); // Serve static files
app.use(expressLayouts); // Enable express-ejs-layouts

// View Engine Setup
app.set("view engine", "ejs");
app.set("layout", "admin/layout"); // Set default layout for views

// Routes
app.use("/admin", require("./routes/adminRoutes")); // Admin routes

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
