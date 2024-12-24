const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");

// Routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Middleware
const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth");

// Passport Configuration
require("./config/passportConfig")(passport);

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/ecommerce", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Database connection error:", err.message));

// Initialize Express App
const app = express();

// Middleware Setup
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.json()); // Parse JSON requests
app.use(cookieParser()); // Parse cookies
app.use(express.static(path.join(__dirname, "public"))); // Serve static files
app.use(expressLayouts); // Enable EJS layouts
app.use(
  session({
    secret: "your-secret-key", // Replace with an actual secret in production
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // Flash messages

// Make flash messages available in all views
app.use((req, res, next) => {
  res.locals.flashMessages = {
    success: req.flash("success"),
    error: req.flash("error"),
  };
  res.locals.user = req.user || null; // User info available globally in views
  next();
});

// View Engine Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/users", userRoutes); // User routes
app.use("/products", productRoutes); // Product routes
app.use("/wishlist", wishlistRoutes); // Wishlist routes
app.use("/admin", adminRoutes); // Admin routes

// Home and Authentication Routes
app.get("/", (req, res) => res.redirect("/products"));
app.get("/signup", (req, res) => {
  res.render("signup", { layout: "homeLayout" });
});
app.get("/login", (req, res) => {
  res.render("login", { layout: "homeLayout" });
});
app.get("/home", restrictToLoggedinUserOnly, (req, res) => {
  res.render("user/home", { layout: "homeLayout" });
});

// Short URL Redirect Route (if required)
app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  try {
    const entry = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: { timestamp: Date.now() },
        },
      }
    );
    if (!entry) {
      return res.status(404).send("URL not found.");
    }
    res.redirect(entry.redirectURL);
  } catch (err) {
    console.error("Error finding URL:", err);
    res.status(500).send("An error occurred.");
  }
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", { message: "Something went wrong!" });
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful Shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("Database connection closed.");
  process.exit(0);
});
