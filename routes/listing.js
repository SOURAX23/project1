const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js")
const wrapAsync=require('../utils/wrapAsync.js');
const expressError=require('../utils/expressError.js');
const {listingSchema,reviewSchema}=require("../schema.js")
const { log } = require("console");
const {isLoggedIn,isOwner,validateListing}=require("../middlewear.js")
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage});



// const ListingController=require("../controllers/listings");
const listingController=require("../controllers/listings.js");

// router.route("/")
//index route
 router.get("/",wrapAsync(listingController.index));

//create NEW
 router.get("/new",isLoggedIn,listingController.renderNew);

//show route
router.get("/:id",wrapAsync(listingController.showListing));

//add route
router.post("/",isLoggedIn,validateListing,upload.single('listing[image]'),wrapAsync(listingController.createListing));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

//change route
router.put("/:id",isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing));

//delete route

router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));


module.exports=router;