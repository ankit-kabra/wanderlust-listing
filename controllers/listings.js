const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  try {
    const { category, search } = req.query;

    // Create an empty query object
    let query = {};

    if (category) query.category = category; // Filter by category

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } }, // Search in title
        { location: { $regex: search, $options: "i" } }, // Search in location
      ];
    }

    // Fetch Listings Using find()
    const allListing = await Listing.find(query).exec(); 

    res.render("./listings/index.ejs", { allListing, selectedCategory: category, searchQuery: search||'' });
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).send("Internal Server Error");
  }
};



module.exports.new = async (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.show = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  console.log(listing);
  if (!listing) {
    req.flash("error", "Listing you requested for dose not exist!");
    res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { listing });
};

// CREATE A LISTING

module.exports.create = async (req, res) => {
  let {filename,path}=req.file;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image={filename:filename,url:path};
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};


module.exports.create = async (req, res, next) => {
  // Check if the file exists
  if (!req.file) {
    req.flash("error", "Image file is required!");
    return res.redirect("/listings/new");
  }

  // Check if the listing data is available
  if (!req.body.listing) {
    req.flash("error", "Listing data is missing!");
    return res.redirect("/listings/new");
  }

  // Destructure filename and path from req.file
  let { filename, path } = req.file;

  // Create a new listing object with the data
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; // Assign the user ID
  newListing.image = { filename: filename, url: path }; // Set the image
  newListing.category= req.body.listing.category;// Assign category from form

  try {
    // Save the new listing to the database
    await newListing.save();

    // Flash success message
    req.flash("success", "New Listing Created!");

    // Redirect to the listings page
    res.redirect("/listings");
  } catch (err) {
    // Handle any errors that occur during the save operation
    next(err); // Forward to error handling middleware
  }
};


module.exports.edit = async (req, res) => {
  // if(!req.body.listing){
  //   throw new ExpressError(400,"please send valid data")
  // }

  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for dose not exist!");
    return res.redirect("/listings");
  }
  let originalImageUrl=listing.image.url;
  originalImageUrl=originalImageUrl.replace("/upload","/upload/w_200");
  res.render("./listings/edit.ejs", { listing,originalImageUrl});
};

module.exports.update = async (req, res) => {
  let listing= await Listing.findByIdAndUpdate(req.params.id, { ...req.body.listing });
  console.log("req.file");
  console.log(req.file);
  if(typeof req.file!=="undefined"){
    let { filename, path } = req.file;
    listing.image = { filename: filename, url: path }; 
  }
 await listing.save();
 
 
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${req.params.id}`);
};

module.exports.destroy = async (req, res) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  req.flash("error", "Listing Delated Successfully!");
  console.log(deleteListing);
  res.redirect("/listings");
};
