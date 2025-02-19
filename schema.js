const Joi =require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      location: Joi.string().required(),
      country: Joi.string().required(),
      price: Joi.number().required().min(0),
      image: Joi.object({
        filename:Joi.string(),
        url: Joi.string()
            .uri()
            .allow("")
            .default("https://images.unsplash.com/photo-1581286106467-9b17ff2f72a8")
    }).optional(),
    category: Joi.string()
    .valid(
      "Trending",
      "Rooms",
      "Iconic cities",
      "Mountains",
      "Castles",
      "Amazing pools",
      "Camping",
      "Farms",
      "Arctic",
      "Domes",
      "Boats",
    )
    .required(), 
    // "image" is optional, but if present, it must be an object
    }).required(),
  });

module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required(),
    }).required(),
});