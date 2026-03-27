const express = require("express");
// const session = require("express-session")
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
require("dotenv").config();

const ExpressError = require("./utils/ExpressError");
const session =require("express-session");
const MongoStore = require("connect-mongo").default;
const flash =require("connect-flash");
const passport=require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// ROUTES
const listingRoutes = require("./routes/listings");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users")

const app = express();


// ---------------- MIDDLEWARE ----------------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));


// ---------------- VIEW ENGINE ----------------
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// ---------------- DATABASE ----------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected 🔥"))
  .catch(err => console.log(err));


// ---------------- ROUTES ----------------

const store = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  crypto: {
    secret: "mysupersecretcode"
  },
  touchAfter: 24 * 3600
});
store.on("error", (err) => {
  console.log("SESSION STORE ERROR", err);
});

const sessionOptions={store,
  secret : "mysupersecretcode",
  resave : false,
  saveUninitialized :true,
  cookie :{
    expires :Date.now() +7*24*60*60*1000,
    maxAge :7*24*60*60*1000,
    httpOnly :true,
  },
};

app.get("/", (req, res) => {
  res.redirect("/listings");
});




app.use(session(sessionOptions));
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;   // ✅ ADD THIS
  next();
});




// HOME


// LISTING ROUTES
app.use("/listings", listingRoutes);

// REVIEW ROUTES (nested)
app.use("/listings/:id/reviews", reviewRoutes);

app.use("/", userRoutes);


// ---------------- 404 HANDLER ----------------
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});


// ---------------- ERROR HANDLER ----------------
app.use((err, req, res, next) => {
  err.statuscode ||= 500;
  err.message ||= "Something went wrong";

  res.status(err.statuscode).render("error.ejs", { err });
});


// ---------------- SERVER ----------------
app.listen(8080, () => {
  console.log("Server running on port 8080 🚀");
});