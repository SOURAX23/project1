const User=require("../models/user.js");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};


module.exports.signup=async(req,res)=>{
    try {let{username,email,password}=req.body;
    const nuser=new User({
        username:username,
        email:email
    });
    const ruser= await User.register(nuser,password);
    console.log(ruser);
    req.login(ruser,(err)=>{
    if(err){
        next(err);
    }
    req.flash("success","Welcome to Wanderlust")
    res.redirect("/listings");
    });} 
    catch (error) {
        req.flash("error",error.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login= async(req,res)=>{
    req.flash("success","Welcome to Wanderlust you are logged in");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","you are logged out now");
        res.redirect("/listings")
    })
};