const Listing = require("../models/listing");
const {cloudinary} = require("../utils/cloudConfig");

module.exports.index = async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/index", { listings });
};

module.exports.renderCreateForm = (req, res) => {
  res.render("listings/create");
};

module.exports.createListing = async (req, res) => {
  const newListing = new Listing(req.body.listing);

  if(req.file){
    newListing.image = {
        url: req.file.path,
        filename: req.file.filename,
  }
  }

  newListing.owner = req.user._id;

  await newListing.save();

  req.flash("success", "Listing created!");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" }
    })
    .populate("owner");

  res.render("listings/show", { listing });
};

module.exports.renderEditForm = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.render("listings/edit", { listing });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  let listing =await Listing.findByIdAndUpdate(id, req.body.listing);
  
  if(req.file ){
    if(listing.image && listing.image.filename){
      await cloudinary.uploader.destroy(listing.image.filename);
    }
  listing.image = {
        url: req.file.path,
        filename: req.file.filename,
  }
await listing.save();
  }
  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}/show`);
};

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;

  await Listing.findByIdAndDelete(id);

  req.flash("success", "Deleted!");
  res.redirect("/listings");
};