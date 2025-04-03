//required files 
const express = require("express");
const router = express.Router();
const listing = require("../models/listing.js");
const{isLoggedIn, isOwner , validiateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer =require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


// WRAPASYNC FUNCTION

function wrapAsync(fn){
    return function(req , res , next){
        fn(req , res , next).catch(next);
    }
}

router.route("/")
.get(wrapAsync (listingController.index))
.post(isLoggedIn , upload.single("listing[image]") , wrapAsync(listingController.addNewListing));


//CRUD OPERATION ROUTE
//CREATE ROUTE
//get route
router.get("/new" , isLoggedIn , wrapAsync(listingController.createNewForm));

//validiate listing is not working
router.route("/:id")
.put(isLoggedIn , isOwner , upload.single("listing[image]") ,  wrapAsync(listingController.editListing))
.delete(isLoggedIn ,isOwner ,  wrapAsync(listingController.destroyListing))
.get(wrapAsync(listingController.showListing));


//EDIT ROUTE
//get route
router.get("/:id/edit" ,  isLoggedIn , isOwner, wrapAsync(listingController.editForm));

module.exports = router;