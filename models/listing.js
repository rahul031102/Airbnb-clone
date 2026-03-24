const mongoose = require("mongoose");
const Schema =mongoose.Schema;
const Review =require("./review.js");

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,

    image: {
      url: String, // image URL
      //required: true,
      filename:String,
      
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    location: {
      city: String,
      country: String,
    },

    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviews:[{
      type:Schema.Types.ObjectId,
      ref:"Review"
    }],
    owner: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
  },
  },
  { timestamps: true }
);

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({
      _id: { $in: listing.reviews }
    });
  }
});

module.exports = mongoose.model("Listing", listingSchema);
