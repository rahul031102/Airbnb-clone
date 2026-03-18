const express = require("express");
const mongoose = require("mongoose");
//const joi = require("joi");
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
require("dotenv").config();

const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");
const app = express();

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

/* ---------------- VIEW ENGINE ---------------- */
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* ---------------- DATABASE ---------------- */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected 🔥"))
  .catch(err => console.log(err));

/* ---------------- ROUTES ---------------- */

app.get("/", (req, res) => {
  res.redirect("/listings");
});

/* INDEX */
app.get("/listings", wrapAsync(async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/index", { listings });
}));

/* CREATE FORM */
app.get("/listings/create", (req, res) => {
  res.render("listings/create");
});

/* CREATE */
app.post("/listings", wrapAsync(async (req, res) => {
//   if (!req.body.listing) {
//     throw new ExpressError(400, "Invalid listing data");
//   }

  if (!req.body.listing.image || req.body.listing.image.trim() === "") {
  delete req.body.listing.image;
}
let result=listingSchema.validate(req.body);
console.log(result)
  await Listing.create(req.body.listing);
  res.redirect("/listings");
}));

/* SHOW */
app.get("/listings/:id/show", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }

  res.render("listings/show", { listing });
}));

/* EDIT FORM */
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }

  res.render("listings/edit", { listing });
}));

/* UPDATE */
app.put("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;

  const updatedListing = await Listing.findByIdAndUpdate(
    id,
    req.body.listing,
    { new: true }
  );

  if (!updatedListing) {
    throw new ExpressError(404, "Listing not found");
  }

  res.redirect(`/listings/${id}/show`);
}));

/* DELETE */
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;

  const deletedListing = await Listing.findByIdAndDelete(id);

  if (!deletedListing) {
    throw new ExpressError(404, "Listing not found");
  }

  res.redirect("/listings");
}));

/* ---------------- 404 HANDLER ---------------- */
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

/* ---------------- ERROR HANDLER ---------------- */
app.use((err, req, res, next) => {
  err.statuscode ||= 500;
  err.message ||= "Something went wrong";

  res.status(err.statuscode).render("error.ejs", { err });
});

/* ---------------- SERVER ---------------- */
app.listen(8080, () => {
  console.log("Server running on port 8080 🚀");
});