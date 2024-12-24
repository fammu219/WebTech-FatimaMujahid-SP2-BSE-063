const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const flash = require('connect-flash');

// Initialize Express App
const app = express();

// Routes and Controllers
const userController = require("./controllers/user");
const adminRoutes = require("./routes/adminRoutes");
const urlRoute = require("./controllers/url");

// Middleware
const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth");

// MongoDB Connection
const connectionString = "mongodb://127.0.0.1:27017/temp";
mongoose
  .connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(`Connected to MongoDB: ${connectionString}`))
  .catch((err) => {
    console.error("Database connection error:", err.message);
    process.exit(1);
  });

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
app.use(flash());

// Make flash messages available in all views
app.use((req, res, next) => {
  res.locals.flashMessages = {
      success: req.flash('success'),
      error: req.flash('error'),
  };
  next();
});

app.post('/test-flash', (req, res) => {
  req.flash('success', 'Item added to cart successfully.');
  res.redirect('/home'); // Redirect to where you want to display the message
});

// View Engine Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Route Middleware Setup
app.use(userController); // User routes
app.use("/admin", adminRoutes); // Admin routes

// Authentication-related Routes
app.get("/signup", (req, res) => {
  res.render("signup", { layout: "homeLayout" });
});
app.get("/login", (req, res) => {
  res.render("login", { layout: "homeLayout" });
});

// Short URL Redirect Route
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

// Home and User Routes
app.get("/", (req, res) => {
  res.render("login", { layout: "homeLayout" });
});

app.get("/home", restrictToLoggedinUserOnly, (req, res) => {
  res.render("user/home", { layout: "homeLayout" });
});

app.get("/admin/products", restrictToLoggedinUserOnly, (req, res) => {
  res.render("admin/products", { layout: "layout" });
});

// Error Handling admin
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", { message: "Something went wrong!" });
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful Shutdown for Database Connection
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("Database connection closed.");
  process.exit(0);
});
