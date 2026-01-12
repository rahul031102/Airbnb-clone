const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");
require("dotenv").config({ path: "../.env" });


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected 🔥"))
  .catch(err => console.log(err));

const initDB=async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("inserted");
};

initDB();

