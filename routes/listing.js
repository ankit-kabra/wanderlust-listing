if(process.env.NODE_ENV="production"){
  require('dotenv').config(); 
}

const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const {cloudinary}=require("../cloudConfig.js");
const upload = multer({ storage });

const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn, // Ensure the user is logged in first
    upload.single("listing[image]"), // Process file & parse form first
    validateListing, // Validate AFTER multer has parsed req.body
    wrapAsync(listingController.create)
  );


//new route
router.get("/new", isLoggedIn, wrapAsync(listingController.new));  

//update route ,show route and delete route
router
  .route("/:id")
  .get( wrapAsync(listingController.show))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.update)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroy));


//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.edit));

module.exports = router;
