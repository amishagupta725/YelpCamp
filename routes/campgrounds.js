var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//DISPLAY ALL CAMPGROUNDS
router.get("/",function(req,res){
    //get all campgrounds from database
    Campground.find({},function(err,allcampgrounds){
      if(err){console.log("Something went wrong");}
      else{
        res.render("campgrounds/index",{campgrounds:allcampgrounds, currentUser:req.user});
      }
    });
  });
  
  
router.post("/",middleware.isLoggedIn,function(req,res){
    //want to get data from form and add to campground
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;
    var author = {
      id: req.user._id,
      username: req.user.username
    }
    var newCampground = {name:name , image:image, description:desc, author:author,price:price}
    //add the campground to database
    Campground.create(newCampground,function(err,newlyCreated){
      if(err){
        console.log("Something went wrong");
      }
      else{
         //redirect back to campground to display
        res.redirect("/campgrounds");
      }
    })
  });
  
  //ADD NEW CAMPGROUND
 router.get("/new",middleware.isLoggedIn,function(req,res){
      res.render("campgrounds/new");
  });
  
  
router.get("/:id",function(req,res){
    //Get all the details of camp acc to ID
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
      if(err){
        console.log("Something went wrong");
      } else {
        //Render a show template to that camp
        res.render("campgrounds/show",{campground : foundCampground});
      }
    });
  });

  //EDIT CAMPGROUND ROUTE
  router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findById(req.params.id, function(err,foundCampground){
          res.render("./campgrounds/edit",{campground:foundCampground});
    });
  });


  //UPDATE CAMPGROUND ROUTE
 router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
 //find and update correct output and redirect
 Campground.findByIdAndUpdate(req.params.id, req.body.campground,function(err,updatedCampground){
   if(err){
     console.log(err);
   }else {
     res.redirect("/campgrounds/"+req.params.id);
   }
 });
 });

 //DESTROY CAMPGROUND ROUTE
 router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
  Campground.findByIdAndRemove(req.params.id,function(err){
    if(err){
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
 });


  module.exports = router;