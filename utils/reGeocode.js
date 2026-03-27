require("dotenv").config();

const mongoose = require("mongoose");
const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const mapToken = process.env.MAP_TOKEN;

const geocoder = mbxGeocoding({ accessToken: mapToken });

// 🔥 CONNECT DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

const reGeocode = async () => {
  const listings = await Listing.find({});

  for (let listing of listings) {
    try {

      if (!listing.location) {
        console.log(`❌ No location: ${listing.title}`);
        continue;
      }

      // 🔥 HANDLE BOTH STRING + OBJECT LOCATION
      let query;

      if (typeof listing.location === "string") {
        query = listing.location;
      } else {
        query = `${listing.location.city}, ${listing.location.country}`;
      }

      // 🔥 GEOCODE
      const geoData = await geocoder.forwardGeocode({
        query: query,
        limit: 1,
      }).send();

      if (!geoData.body.features.length) {
        console.log(`❌ Skipped (no result): ${listing.title}`);
        continue;
      }

      // 🔥 SAVE GEOMETRY
      listing.geometry = geoData.body.features[0].geometry;

      await listing.save();

      console.log(`✅ Updated: ${listing.title}`);

    } catch (err) {
      console.log(`❌ Error on ${listing.title}`);
    }
  }

  console.log("🔥 DONE RE-GEOCODING");

  mongoose.connection.close();
};

reGeocode();