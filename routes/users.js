// const express = require("express");
// const router = express.Router();

// const passport = require("passport");
// const User = require("../models/user");
// const { saveRedirectUrl } = require("../middleware");

// // ================= SIGNUP FORM =================
// router.get("/signup", (req, res) => {
//   res.render("users/signup",{layout:false});
// });

// // ================= SIGNUP =================
// router.post("/signup", async (req, res, next) => {
//   try {
//     const { username, email, password } = req.body;

//     const newUser = new User({ username, email });

//     const registeredUser = await User.register(newUser, password);
//     console.log(registeredUser);
//     // auto login after signup
//     req.login(registeredUser, (err) => {
//       if (err) return next(err);

//       req.flash("success", "Welcome to Wanderlust!");
//       res.redirect("/listings");
//     });

//   } catch (e) {
//     req.flash("error", e.message);
//     res.redirect("/signup");
//   }
// });

// // ================= LOGIN FORM =================
// router.get("/login", (req, res) => {
//   res.render("users/login");
// });

// // ================= LOGIN =================
// router.post(
//   "/login",
//   saveRedirectUrl,
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   (req, res) => {
//     req.flash("success", "Welcome back!");

//     let redirectUrl = res.locals.redirectUrl || "/listings";
//     res.redirect(redirectUrl);
//   }
// );

// // ================= LOGOUT =================
// router.post("/logout", (req, res, next) => {
//   req.logout(function(err) {
//     if (err) return next(err);

//     req.flash("success", "Logged out successfully!");
//     res.redirect("/listings");
//   });
// });

// module.exports = router;

const express = require("express");
const router = express.Router();

const passport = require("passport");
const usersController = require("../controllers/users");
const { saveRedirectUrl } = require("../middleware");

// SIGNUP
router
  .route("/signup")
  .get(usersController.renderSignup)
  .post(usersController.signup);

// LOGIN
router
  .route("/login")
  .get(usersController.renderLogin)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    usersController.login
  );

// LOGOUT
router.post("/logout", usersController.logout);

module.exports = router;