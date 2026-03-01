if(process.env.NODE_ENV !="production"){
require('dotenv').config(); // or import 'dotenv/config' if you're using ES6
}
// console.log(process.env.SECRET); remove this after you've confirmed it is working

const exp=require("express");
const app=exp();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejs=require("ejs-mate");
const { log } = require("console");
const expressError=require('./utils/expressError.js');
const murl="mongodb://127.0.0.1:27017/wanderlust";
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const userRouter=require("./routes/user.js")
const session =require("express-session");
const MongoStore=require("connect-mongo");
const flash=require('connect-flash');
const passport=require("passport");
const Localstrat=require("passport-local");
const User=require("./models/user.js");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const dbUrl=process.env.ATLASDB_URL;

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on('error',(err)=>{
    console.log("error in mongo store",err);
});
 

const sessionOptions={
    secret:process.env.SECRET,
    store,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() +1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
        httpOnly:true
    }
};



main()
        .then(()=>{
            console.log('Connected to Database');
        })
        .catch((err)=>{
            console.log(err);
        });

async function main(){
    await mongoose.connect(dbUrl);
}


app.use(exp.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs",ejs);
app.use(exp.static(path.join(__dirname,"/public")));
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrat(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    // console.log(res.locals.success);
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

app.get("/demo",async(req,res)=>{
    let fuser=new User({
        email:"stu@gmail.com",
        username:"sostu",
    });
    let ruser=await User.register(fuser,"helloworld");
    res.send(ruser);
});

app.get("/",(req,res)=>{
    res.send("This is working");
});

// app.get("/testListing",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"my new villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calangute ,Goa",
//         country:"India"
//     })
//     await sampleListing.save();
//     console.log("data was saved");
//     res.send("success");
// });

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",userRouter);
  // let result=listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new expressError(400,result.error);
    // } 

app.all(/.*/,(req,res,next)=>{
    next(new expressError(404,"page not found"));

}); 
app.use((err,req,res,next) => {
    let {status=500,message="something went wrong"}=err;
    res.status(status).render("error.ejs",{err});
    // res.status(status).send(message);
    // next(err);
});

app.listen(3000,(req,res)=>{
    console.log('server is listening on on port 3000');
});   