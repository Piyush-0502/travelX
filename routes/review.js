//required files 
const express = require("express");
const router = express.Router({mergeParams: true});
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const listing = require("../models/listing.js");
const {validiateReview , isLoggedIn , isReviewAuthor} = require("../middleware.js");
const reviewControllers = require("../controllers/reviews.js")


//REVIEWS SECTION
// post route
//TO ADD NEW REVIEW
router.post("/" ,isLoggedIn, wrapAsync(reviewControllers.addNewReview));

//delete review
router.delete("/:reviewid" ,isLoggedIn ,isReviewAuthor, wrapAsync(reviewControllers.destroyReview));

// WRAPASYNC FUNCTION

function wrapAsync(fn){
    return function(req , res , next){
        fn(req , res , next).catch(next);
    }
};

module.exports = router ;
