const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utils/wrapAsync.js');
const expressError=require('../utils/expressError.js');
const {reviewSchema}=require("../schema.js")
const review=require("../models/review.js")
const { log } = require("console");
const Listing=require("../models/listing.js");
const {validateReview, isLoggedIn,isAuthor}=require("../middlewear.js")
const reviewController=require("../controllers/reviews.js")

//REVIEWS route
router.post("/",validateReview,isLoggedIn,wrapAsync(reviewController.createReview));

router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.destroyRoute))

module.exports=router;