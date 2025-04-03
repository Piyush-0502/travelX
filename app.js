//required files
if(process.env.NODE_ENV != "production "){
    require('dotenv').config();
} 

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy =require("passport-local");
const user = require("./models/user.js");

//routers
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

//mongo atlas URL
const dbUrl = process.env.MONGO_ATLAS_URL;


//setting paths 
app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views" ));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname , "/public")));


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto : {
        secret: process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error" , ()=>{
    console.log("ERROR OCCURED IN MONGO SESSION STORE" , err);
})

const sessionOptions={
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now()+1000*60*60*24*7,
        maxAge : 1000*60*60*24*7 ,
        httpOnly : true ,
    },
};

//Root route
// app.get("/" , (req , res)=>{
//     res.send("i m rooot  ")
// });



app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate())); 

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());



app.use((req , res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curruser = req.user;
    next();
});



//mongoose connection 
main().then(()=>{
    console.log("connect successful to db ");
}).catch(err => {
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl);
};


//routers use
app.use("/listings" , listingsRouter);
app.use("/listings/:id/reviews" , reviewsRouter);
app.use("/" , userRouter);


// middleware to error handle
app.all("*" , (req , res ,next)=>{
    next(new ExpressError(404 , "page not found"));
});
//
app.use((err , req ,res , next)=>{
    let{statusCode=400 , message="someting went wrong"} = err ;
    res.status(statusCode).render("error.ejs" , { message });
    next();
});


// Port running
app.listen(8080 , ()=>{
    console.log("server is listening to port 8080");
});
