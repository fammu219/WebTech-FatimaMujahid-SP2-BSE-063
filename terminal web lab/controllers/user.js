const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const { setUser } = require("../service/auth");
const express=require("express");
const router=express.Router();

router.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!role) {
    return res.status(400).render("signup", { error: "Role is required (admin/customer)" });
  }

  await User.create({
    name,
    email,
    password,
    role: role.toLowerCase(), // Ensuring role is in lowercase (e.g., 'admin' or 'customer')
  });

  return res.redirect("/login");
});



router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
//  return res.send(user)
  if (!user) {
    return res.render("login", {
      error: "Invalid Username or Password",
    });
  }
  req.session.user = user;

  // Role-based redirection
  if (user.role === 'admin') {
    return res.redirect("/admin/products");
  } else if (user.role === 'customer') {
    return res.redirect("/home");
  } else {
    return res.render("login", {
      error: "Invalid Role",
    });
  }
});





module.exports =router;