const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");

//mongoose connection 
main().then(()=>{
    console.log("connect successful to db ");
}).catch(err => {
    console.log(err);
});

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/travelX')
}



const initDB = async ()=>{
    await listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj , owner:'67d96b4225b457b2c354c385'}))
    await listing.insertMany(initData.data);
    console.log("data was saved ");
}


initDB();