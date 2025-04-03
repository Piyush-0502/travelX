const listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const{listingSchema , reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req , res , next)=>{
    if(!req.isAuthenticated()){
        //redirect user save
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "You Must Login To Do This Operation ");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req , res , next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}



module.exports.isOwner = async (req , res , next )=>{
    let {id} = req.params;
    let Listing = await listing.findById(id);
    if(!Listing.owner._id.equals(res.locals.curruser._id)){
        req.flash("error" , "You Don't Have Permission Because You Are Not The Owner");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


//SCHEMA VALIDATION

module.exports.validiateListing = (req , res , next ) =>{
    let{error}=listingSchema.validate(req.body);
    if(error){
        let errMsg = err.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
        
    }else{
        next();
    }
};


// validiate review
module.exports.validiateReview = (req , res , next ) =>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg = err.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};


//isauthor review deletye authorization
module.exports.isReviewAuthor = async (req , res , next )=>{
    let {id , reviewid} = req.params;
    let review = await Review.findById(reviewid);
    if(!review.author._id.equals(res.locals.curruser._id)){
        req.flash("error" , "You Don't Have Permission Because You Are Not The Author");
        return res.redirect(`/listings/${id}`);
    }
    next();
}