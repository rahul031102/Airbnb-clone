const User = require("../models/user");
const passport = require("passport");

// SIGNUP FORM
module.exports.renderSignup = (req, res) => {
  res.render("users/signup");
};

// SIGNUP LOGIC
module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({ username, email });

    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);

      req.flash("success", "Welcome to Airbnb!");
      res.redirect("/listings");
    });

  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

// LOGIN FORM
module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

// LOGIN LOGIC
module.exports.login = (req, res) => {
  req.flash("success", "Welcome back!");

  // 🔥 IMPORTANT (redirect logic)
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

// LOGOUT
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.flash("success", "Logged out!");
    res.redirect("/listings");
  });
};