
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
require("dotenv").config();

const app = express(); // ✅ app FIRST

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method")); // ✅ after app
app.use(express.static(path.join(__dirname, "public")));

// View engine
app.engine("ejs", ejsMate);   
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected 🔥"))
  .catch(err => console.log(err));


app.get("/", (req, res) => {

       // res.send("im groot");
res.redirect("/listings");
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

app.get("/listings/create",(req,res)=>{
    res.render("listings/create");
});

app.post("/listings",async(req,res)=>{
    await Listing.create(req.body.listing);
   console.log(req.body.listing);
    res.redirect("/listings");
});



app.get("/listings/:id/show",async(req,res)=>{
    let {id}=req.params;
    console.log(req.params.id);
    let listing=await Listing.findById(id);
    res.render("listings/show",{listing});
});

app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("listings/edit",{listing});
});

app.put("/listings/:id",async(req,res)=>{
     //await Listing.create(req.body.listing);
const { id } = req.params;
    //console.log(req.body.listing);
       let update=await Listing.findByIdAndUpdate(id,req.body.listing); 

    res.redirect(`/listings/${id}/show`);
});
app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
   res.redirect("/listings");
});


app.listen(8080,()=>{
        console.log("success");
});
