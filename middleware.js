const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
 
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
 
    req.flash("error", "you must be logged in ");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;

  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  try {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    if (!res.locals.currUser._id.equals(listing.owner._id)) {
      req.flash("error", "You don't have permission to edit this listing");
      return res.redirect(`/listings/${id}`);
    }
    next();
  } catch (err) {
    req.flash("error", "Something went wrong. Please try again later.");
    return res.redirect("/listings");
  }
};

module.exports.validateListing = (req, res, next) => {

  const { error } = listingSchema.validate(req.body, { abortEarly: false });
  if (error) {
    console.error(error); // Logs validation details
    const errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};


module.exports.isReviewAuthor = async (req, res, next) => {
  try {
  
    let { id,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review) {
      req.flash("error", "review not found");
      return res.redirect("/listings");
    }

    if (!res.locals.currUser._id.equals(review.author)) {
      req.flash("error", "You don't have permission to edit this Review");
      return res.redirect(`/listings/${id}`);
    }
    next();
  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong. Please try again later.");
    return res.redirect("/listings");
  }
};