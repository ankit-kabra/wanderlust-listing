const mongoose = require("mongoose");
const review = require("./review");
const { types } = require("joi");

const Schema = mongoose.Schema;

const listingSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      filename: { type: String, trim: true, default: "" },
      url: {
        type: String,
        default: "https://https://images.unsplash.com/photo-1581286106467-9b17ff2f72a8.com/photos/Aln972onVgE",
        set: (v) => (v === "" ? "https://images.unsplash.com/photo-1581286106467-9b17ff2f72a8://unsplash.com/photos/Aln972onVgE" : v),
        validate: {
          validator: function (v) {
            return /^https?:\/\/.+/i.test(v); // Basic URL validation
          },
          message: (props) => `${props.value} is not a valid URL!`,
        },
      },
    },
    price: {
      type: Number,
      min: [0, "Price cannot be negative"],
    },
    location: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    owner:{
      type:Schema.Types.ObjectId,
      ref:"User"
    },
    category: {
      type: String,
      enum: [
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
      ],
      default: "Trending",
    },
  },

  { timestamps: true }
);

listingSchema.post("findOneAndDelete",async(listing)=>{
if(listing){
    await review.deleteMany({_id:{$in: listing.reviews}});
}
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
