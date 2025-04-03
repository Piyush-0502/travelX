const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new mongoose.Schema(
    {
    rating : {
        type : Number ,
        min : 1,
        max : 5
    },

    comment:{
        type: String 
    },
   
    createdAt:{
        type : Date ,
        default :Date.now()
    },
    
    author:{
        type : Schema.Types.ObjectId,
        ref: "user",
    }
});


const review = mongoose.model("review" , reviewSchema);
module.exports = review;

