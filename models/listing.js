const { ref } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new mongoose.Schema(
    {title :{
        type : String ,
        required : true
    },
    description:{
        type : String 
    },
    image: {
       url: String,
       filename: String
    },
    price:{
        type : Number ,
        min : [1, "please enter valid price "]
    },
    location:{
        type : String
    },
    country : {
        type: String
    },
    reviews : [{
        type : Schema.Types.ObjectId,
        ref : "review"
    }],
    owner:{
        type : Schema.Types.ObjectId,
        ref : "user"
    }
});


const listing = mongoose.model("listing" , listingSchema);
module.exports = listing;
