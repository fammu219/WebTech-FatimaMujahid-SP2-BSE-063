// Middleware to restrict access to admin users
function restrictToAdmin(req, res, next) {
  if (req.session?.user?.role === "admin") {
    return next();
  }
  req.flash('error_msg', 'Access restricted to admins only.');
  res.status(403).redirect('/'); // Redirect to home or another appropriate page
}

// Middleware to restrict access to logged-in users only
function restrictToLoggedinUserOnly(req, res, next) {
  if (req.session?.user) {
    return next();
  }
  req.flash('error_msg', 'Please log in to access this resource.');
  res.status(401).redirect('/login'); // Redirect to login page
}

// Middleware to check if user is logged in without restricting access
function checkAuth(req, res, next) {
  req.user = req.session?.user || null;
  next();
}

// Middleware to ensure user is authenticated using Passport.js
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'Please log in to view this resource.');
  res.redirect('/users/login'); // Redirect to the login page
}

// Middleware to restrict guests (unauthenticated users)
function ensureGuest(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/products'); // Redirect to an appropriate page for authenticated users
}

// Export all middleware functions
module.exports = {
  restrictToAdmin,
  restrictToLoggedinUserOnly,
  checkAuth,
  ensureAuthenticated,
  ensureGuest,
};
