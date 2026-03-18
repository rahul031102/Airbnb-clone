const mongoose = require("mongoose");
const Schema =mongoose.Schema;

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,

    image: {
      type: String, // image URL
      //required: true,
      default:"/images/rahul.jpg",
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
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing", listingSchema);
