const listing = require("../models/listing");
const Review = require("../models/review")


//add new review
module.exports.addNewReview = async(req , res)=>{
    let Listing = await listing.findById(req.params.id);
    let newReview = new Review (req.body.review);
    newReview.author = req.user._id;
    Listing.reviews.push(newReview);
    await newReview.save();
    await Listing.save();
    req.flash("success" , "New Review Added");
    res.redirect(`/listings/${Listing._id}`);
}

//destroy review
module.exports.destroyReview = async(req,res)=>{
    let{id , reviewid} = req.params;
    await Review.findByIdAndDelete(reviewid);
    await listing.findByIdAndUpdate(id , {$pull:{review : reviewid}});
    req.flash("success" , "Review Deleted Successfully");
    res.redirect(`/listings/${id}`);
}
