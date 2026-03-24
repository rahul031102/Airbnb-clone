const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  comment: String,

  rating: {
    type: Number,
    min: 1,
    max: 5
  },

  // 🔥 FIXED AUTHOR
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }

}, { timestamps: true }); // 🔥 auto createdAt & updatedAt

module.exports = mongoose.model("Review", reviewSchema);