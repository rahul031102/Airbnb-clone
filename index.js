const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
require("dotenv").config();

const app = express(); // ✅ app FIRST

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method")); // ✅ after app
app.use(express.static(path.join(__dirname, "public")));

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected 🔥"))
  .catch(err => console.log(err));


app.get("/", (req, res) => {

        res.send("im groot");
});


app.get("/listings",async(req,res)=>{
    let listings=await Listing.find({});
    res.render("listings/index",{listings});
});

app.get("/testlisting",async(req,res)=>{
   try{
    let sample=new Listing({
        title:"rahul villa" ,
	description:"swimming",
        price:20000,
	location:{
	city:"hyderabad",
	country:"india",
	},
});
await sample.save();
console.log(sample);
res.send("yo working");
} catch (err) {
    console.error(err);
    res.status(500).send("Error saving listing");
  }
});



app.listen(8080,()=>{
        console.log("success");
});
