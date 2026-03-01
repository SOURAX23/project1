const Listing=require("../models/listing.js");

module.exports.index=async(req,res)=>{
     const allL=await Listing.find({});
     res.render("listings/index.ejs",{allL});
 
 };

 module.exports.renderNew=(req,res)=>{
    console.log(req.user);
    res.render("listings/new.ejs");
};

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    // console.log(id);
    const listing=await Listing.findById(id)
    .populate({path:"reviews",
        populate:{
            path:"author"
        },
    })
    .populate("owner");
    if(!listing){
        req.flash('error',"listing you requested does not exist");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});

};

module.exports.createListing=async(req,res,next)=>{
    // let {title,description,price,image,location,country}=req.body;
    let url=req.file.path;
    let filename=req.file.filename;
    // console.log(url,filename);
    let listing=req.body.listing;
    const nlist= new Listing(listing);
    nlist.owner=req.user._id;
    nlist.image={url,filename};
    await nlist.save();
    console.log(nlist);
    req.flash('success',"New listing created");
    res.redirect("/listings");
};

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    console.log(listing);
    if(!listing){
        req.flash('error',"listing you requested does not exist");
        return res.redirect("/listings");
    }
    // console.log(listing.image.url);
    // let originalImageUrl=listing.image.url;
    // originalImageURL=originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing});

};

module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    console.log(req.body.listing);
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing,image:{url:req.body.listing.image}});
    if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    req.flash('success',"New listing updated");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing=async(req,res)=>{
    let {id}=req.params;
    // console.log(id);
    const listing=await Listing.findByIdAndDelete(id);
    console.log(listing);
    req.flash('success',"New listing deleted");
    res.redirect("/listings");
};