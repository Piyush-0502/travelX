const listing = require("../models/listing");

module.exports.index = async(req , res , next)=>{
    const allListings = await listing.find({});
    res.render("listings/index.ejs", {allListings});
}

//create new get route
module.exports.createNewForm = async (req,res,next)=>{
   
    res.render("listings/new.ejs");
}

//create new post route
module.exports.addNewListing = async(req , res, next )=>{
    //let {title ,description , image , price , location , country} = req.body
    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url , filename }
    await newListing.save();
    req.flash("success" , "New Listing Created");
    res.redirect("/listings");
}

//edit listing get route
module.exports.editForm = async (req , res , next)=>{
    let {id} = req.params;
    const Listing = await listing.findById(id);
    if(!Listing){
        req.flash("error" , "Listing Requested To Delete Does Not Exist");
        res.redirect("/listings");
    } 

    let originalImageUrl = Listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload" , "/upload/w_250");
    res.render("listings/edit.ejs" , {Listing , originalImageUrl });
}

//edit post route
module.exports.editListing = async(req , res , next)=>{
    let {id} = req.params;
    let Listing = await listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !=="undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    Listing.image = { url , filename };
    await Listing.save();
    }
    req.flash("success" , "Listing Updated Successfully");
    res.redirect(`/listings/${id}`);
}

//destroy route
module.exports.destroyListing = async (req , res , next)=>{
    let {id} = req.params;
    let deletedList = await listing.findByIdAndDelete(id);
    console.log(deletedList);
    req.flash("success" , "Listing Deleted Succesfully");
    res.redirect("/listings");

}

//show listing route
module.exports.showListing = async (req , res , next) =>{
    let {id} = req.params;
    const Listing = await listing.findById(id).populate({path :"reviews" , populate : { path : "author" }}).populate("owner");
    if(!Listing){
        req.flash("error" , "Listing Does Not Exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs" , {Listing});
}