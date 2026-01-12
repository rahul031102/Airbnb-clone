const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,

    image: {
      type: String, // image URL
      required: true,
      default:"/images/building.jpg",
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing", listingSchema);
