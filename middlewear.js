const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
 const expressError=require('./utils/expressError.js');
 const {listingSchema,reviewSchema}=require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create a listing");
        return res.redirect("/login");
    }
    next();
}
module.exports.validateReview=(req,res,next)=>{
        let {error}=reviewSchema.validate(req.body);
    if(error){
        let errmssg=error.details.map((el)=> el.message).join(",");
        throw new expressError(400,errmssg);
    }else{
        next();//middlewear
    }
};


//save in locals so that passport does reset session but url doesnt get deleted
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;   
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error",'You do not have permission to edit');
        return  res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing=(req,res,next)=>{
         let {error}=listingSchema.validate(req.body);
     if(error){
         let errmssg=error.details.map((el)=> el.message).join(",");
         throw new expressError(400,errmssg);
     }else{
         next();//middlewear
     }
 };

 module.exports.isAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error",'You are not the author of review');
        return  res.redirect(`/listings/${id}`);
    }
    next();
}
