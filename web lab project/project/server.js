const express = require("express");
//const config = require('./config.json');
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const userRoute = require('./routes/user');
const adminRoutes = require('./routes/adminRoutes')
const cookieParser = require('cookie-parser');
const URL = require("./models/url");
const urlRoute = require("./controllers/url");
const {restrictToLoggedinUserOnly, checkAuth} = require('./middlewares/auth');
//const myMiddleware = require('./middleware');


// MongoDB Connection
const connectionString = "mongodb://127.0.0.1:27017/temp";
mongoose
  .connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(`Connected to MongoDB: ${connectionString}`);
  })
  .catch((err) => {
    console.error("Database connection error:", err.message);
    process.exit(1);
  });

// Middleware
app.use(express.urlencoded({ extended: true })); // Parse incoming form data
app.use(express.json()); // Parse JSON
app.use(express.static(path.join(__dirname, "public"))); // Serve static files
app.use(expressLayouts); // Enable express-ejs-layouts
app.use("/user",userRoute);
app.use("/admin",adminRoutes)
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
//app.use("/url", restrictToLoggedinUserOnly, urlRoute);
//app.use("/", checkAuth, staticRoute);
//app.use(myMiddleware); 

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});


// View Engine Setup
app.set("view engine", "ejs");

// Routes
productcontroller = require("./routes/adminRoutes") ;
app.use(productcontroller);

// Home Route
app.get("/", (req, res) => {
  res.render("admin/dashboard", {layout : 'layout'});
});

app.get("/home", (req, res) => {
  res.render("user/home",  {layout : 'homeLayout'});
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start the Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful Shutdown for Database Connection
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("Database connection closed.");
  process.exit(0);
});




