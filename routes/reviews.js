// const express = require("express");
// const router = express.Router({ mergeParams: true });

// const Listing = require("../models/listing");
// const Review = require("../models/review");
// const { reviewSchema } = require("../schema");
// const ExpressError = require("../utils/ExpressError");
// const {isLoggedIn, isReviewAuthor } = require("../middleware");
// const {isOwner  } = require("../middleware");

// // CREATE REVIEW
// router.post("/", isLoggedIn,async (req, res) => {
//   const { error } = reviewSchema.validate(req.body);

//   if (error) {
//     throw new ExpressError(400, error.details[0].message);
//   }

//   const { id } = req.params;
//   const listing = await Listing.findById(id);

//   const newReview = new Review(req.body.review);
//   newReview.author=req.user._id;
//   listing.reviews.push(newReview);

//   await newReview.save();
//   await listing.save();

//   res.redirect(`/listings/${id}/show`);
// });

// // DELETE REVIEW
// router.delete("/:reviewId",isLoggedIn, isReviewAuthor, async (req, res) => {
//   const { id, reviewId } = req.params;

//   await Listing.findByIdAndUpdate(id, {
//     $pull: { reviews: reviewId },
//   });

//   await Review.findByIdAndDelete(reviewId);

//   res.redirect(`/listings/${id}/show`);
// });

// module.exports = router;

const express = require("express");
const router = express.Router({ mergeParams: true });

const reviews = require("../controllers/reviews");
const { isLoggedIn, isReviewAuthor } = require("../middleware");

router.post("/", isLoggedIn, reviews.createReview);

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, reviews.deleteReview);

module.exports = router;