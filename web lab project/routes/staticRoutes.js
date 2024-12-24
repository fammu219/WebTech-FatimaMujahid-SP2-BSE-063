const express = require("express");
const URL = require("../models/url");

const router = express.Router();

router.get("/", async (req, res) => {
  if (!req.user) return res.redirect("/login");
  const allurls = await URL.find({ createdBy: req.user._id });
  return res.render("home", {
    urls: allurls,
  });
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.get("/login", (req, res) => {
  return res.render("login");
});


router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  // Validation
  if (!username || !email || !password) {
    return res.status(400).send("All fields are required.");
  }

  try {
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.redirect("/login"); // Redirect to login after successful signup
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to create new user.");
  }
});

module.exports = router;