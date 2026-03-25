const Listing = require("../models/listing");
const { cloudinary } = require("../utils/cloudConfig");
const geocoder = require("../utils/geocoder");

// 🔥 Mapbox setup
// const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
// const mapToken = process.env.MAP_TOKEN;
// const geocoder = mbxGeocoding({ accessToken: mapToken });


// =======================
// 📌 INDEX (All listings)
// =======================
module.exports.index = async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/index", { listings });
};


// =======================
// 📌 CREATE FORM
// =======================
module.exports.renderCreateForm = (req, res) => {
  res.render("listings/create");
};


// =======================
// 📌 CREATE LISTING
// =======================
module.exports.createListing = async (req, res) => {

  // 🔥 Convert location → coordinates
  const geoData = await geocoder
  .forwardGeocode({
    query: `${req.body.listing.location.city}, ${req.body.listing.location.country}`,
    limit: 1,
  })
  .send();

  const newListing = new Listing(req.body.listing);

  // 🔥 Image upload
  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  // 🔥 Save geometry (MOST IMPORTANT)
  newListing.geometry = geoData.body.features[0].geometry;

  // 🔥 Owner
  newListing.owner = req.user._id;

  await newListing.save();

  req.flash("success", "Listing created!");
  res.redirect("/listings");
};


// =======================
// 📌 SHOW LISTING
// =======================
module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" }
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  res.render("listings/show", {
    listing,
    mapToken: process.env.MAP_TOKEN, // 🔥 REQUIRED FOR MAP
  });
};


// =======================
// 📌 EDIT FORM
// =======================
module.exports.renderEditForm = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.render("listings/edit", { listing });
};


// =======================
// 📌 UPDATE LISTING
// =======================
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(id, req.body.listing, {
    new: true,
  });

  // 🔥 Update image if new uploaded
  if (req.file) {
    if (listing.image && listing.image.filename) {
      await cloudinary.uploader.destroy(listing.image.filename);
    }

    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  // 🔥 Update geometry if location changed
  if (req.body.listing.location) {
    const geoData = await geocoder
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();

    listing.geometry = geoData.body.features[0].geometry;
  }

  await listing.save();

  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};


// =======================
// 📌 DELETE LISTING
// =======================
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;

  await Listing.findByIdAndDelete(id);

  req.flash("success", "Deleted!");
  res.redirect("/listings");
};