const mongoose = require("mongoose");
const Listing=require("../models/listing.js");
const initData=require("./data.js")

const mongoUrl = "mongodb://127.0.0.1:27017/wonderlust";

main()
  .then((res) => {
    console.log("connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongoUrl);
}

const initDB=async()=>{
  await  Listing.deleteMany({});
 
initData.data= initData.data.map((obj)=>({
    //spread operator and add new prop
    ...obj,owner:"6792265c7cdecae40277e329"
  }));
  console.log(initData.data);
  await Listing.insertMany(initData.data);
}
initDB();