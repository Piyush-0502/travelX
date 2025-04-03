const user = require("../models/user")

//signup get route
module.exports.getsignupForm = async(req , res)=>{
    res.render("users/signup.ejs");
}

//signup post route
module.exports.signUpUser = async(req , res)=>{
    try{
        let{username , email , password } = req.body;
        const newuser = new user({email , username});
        const registeredUser = await user.register(newuser , password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success" , "welcome to TravelX");
            res.redirect("/listings");
        })
    }catch(e){
        req.flash("error" , e.message);
        res.redirect("/signup");
    }
}

//login get form
module.exports.getLoginForm = async(req , res)=>{
    res.render("users/login.ejs");
}

//login post route
module.exports.LogIn = async(req , res)=>{
    req.flash("success" , "welcome to travelX Login Successful");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

//logout route
module.exports.logOut = (req , res , next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success" , "logged out !!");
        res.redirect("/listings")
    })
}

