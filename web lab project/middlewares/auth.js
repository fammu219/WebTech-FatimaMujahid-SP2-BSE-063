// middlewares/auth.js

// Middleware to restrict access to admin users
function restrictToAdmin(req, res, next) {
  if (req.session?.user?.role === "admin" ) {
    return next();
  }
}

// Middleware to restrict access to logged-in users only
function restrictToLoggedinUserOnly(req, res, next) {
  if (req.session?.user) {
    return next();
  }
  res.status(401).redirect("/login");
}

// Middleware to check if user is logged in without restricting access
function checkAuth(req, res, next) {
  req.user = req.session?.user || null;
  next();
}

module.exports = {
  restrictToAdmin,
  restrictToLoggedinUserOnly,
  checkAuth,
}