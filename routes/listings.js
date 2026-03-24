const express = require("express");
const router = express.Router();

const multer = require("multer");
const { storage } = require("../utils/cloudConfig");

const upload = multer({ storage });

const listings = require("../controllers/listings");
const { isLoggedIn, isOwner } = require("../middleware"); 
const wrapAsync = require("../utils/wrapAsync");
// // INDEX
router.get("/", listings.index);

// CREATE
router.get("/create", isLoggedIn, listings.renderCreateForm);
router.post("/", isLoggedIn, 
  upload.single("listing[image]"),
  wrapAsync(listings.createListing)
);

// SHOW
router.get("/:id/show", listings.showListing);

// EDIT
router.get("/:id/edit", isLoggedIn, isOwner, listings.renderEditForm);
router.put("/:id", isLoggedIn, isOwner,upload.single("listing[image]"), listings.updateListing);

// DELETE
router.delete("/:id", isLoggedIn, isOwner, listings.deleteListing);

module.exports = router;