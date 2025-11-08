// const mongoose= require("mongoose");
// const initData = require ("./data.js");
// const Listing=require("../models/listing.js");


// const MONGO_URL = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";
// require('dotenv').config();

 
// main().then(()=>{
//     console.log("Connected To Db");
// }).catch(err=>{
//     console.log(err);
// });

// async function main() {
//     await mongoose.connect(MONGO_URL);
// }

// const initDB=async()=>{
//     await Listing.deleteMany({});
//     initData.data=initData.data.map((obj)=>({...obj,owner:"68e50834a6f6aea525efe60a"}))
//     await Listing.insertMany(initData.data);
//     console.log("Data Was Initialize ");
// };

// initDB();

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
require("dotenv").config();

const MONGO_URL = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "69099224fb00ba23e0ae5971",
  }));
  await Listing.insertMany(initData.data);
  console.log("🌱 Data was initialized successfully!");
  mongoose.connection.close(); // close after insert
};

initDB();
