const Listing = require("./models/listing");
const Review = require("./models/review");


module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.get("Referer");

    req.flash("error", "Please login first nigga sir!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
};



// module.exports.isOwner = async (req, res, next) => {
//   let { id } = req.params;

//   let listing = await Listing.findById(id);

//   if (!listing.owner.equals(req.user._id)) {
//     req.flash("error", "You are not the owner!");
//     return res.redirect(`/listings/${id}/show`);
//   }

//   next();
// };


module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  if (!req.user) {
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }

  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You are not authorized");
    return res.redirect(`/listings/${id}/show`);
  }

  next();
};


module.exports.isReviewAuthor = async (req, res, next) => {
  const { reviewId } = req.params;

  const review = await Review.findById(reviewId);

  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You are not the author of this review!");
    return res.redirect("back");
  }

  next();
};