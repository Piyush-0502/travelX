const express = require("express");
const router = express.Router();
const user = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userControllers = require("../controllers/users.js")



// WRAPASYNC FUNCTION

function wrapAsync(fn){
    return function(req , res , next){
        fn(req , res , next).catch(next);
    }
};

//signup
router.route("/signup")
.get(wrapAsync(userControllers.getsignupForm))
.post(wrapAsync(userControllers.signUpUser));



//Login
router.route("/login")
.get(wrapAsync(userControllers.getLoginForm))
.post(
    saveRedirectUrl,
    passport.authenticate("local" , {
    failureRedirect : "/login" , 
    failureFlash : true
    }) ,
    wrapAsync(userControllers.LogIn));

    //logout
router.get("/logout" , userControllers.logOut)



module.exports = router;


