// const mongoose = require("mongoose");
// const initData = require("./data.js");
// const Listing = require("../models/listing.js");
// const Review = require("../models/review.js"); // 🔥 ADD THIS
// require("dotenv").config({ path: "../.env" });

// mongoose.connect(process.env.MONGO_URI)
//   .then(async () => {
//     console.log("MongoDB Atlas Connected 🔥");
//     await initDB();
//   })
//   .catch(err => console.log(err));

// const initDB = async () => {
//   await Listing.deleteMany({});

//   await Review.deleteMany({});   // 🔥 ADD THIS (IMPORTANT)

//   initData.data = initData.data.map((obj) => ({
//     ...obj,
//     owner: new mongoose.Types.ObjectId("69be5d3ca092946eb254701c")
//   }));

//   await Listing.insertMany(initData.data);

//   console.log("Listings + Reviews reset ✅");
// };

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

require("dotenv").config({ path: "../.env" });

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    initDB();
  })
  .catch(err => console.log(err));

const initDB = async () => {
  await Listing.deleteMany({});

  const user = await User.findOne(); // take any user

  const newData = initData.data.map((obj) => ({
    ...obj,

    // 🔥 FIX LOCATION STRUCTURE
    location: {
      city: obj.location,
      country: obj.country,
    },

    // 🔥 ADD OWNER
    owner: user._id,
  }));

  await Listing.insertMany(newData);

  console.log("Data initialized properly ✅");
};