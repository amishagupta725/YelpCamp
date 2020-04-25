var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");
//==============================================================
//COMMENTS ROUTES
//---------------------------------------------------------------
router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn,function(req,res){
    //find campground by id
    Campground.findById(req.params.id,function(err,campground){
      if(err){
        console.log(err);
      } else {
        res.render("comments/new",{campground:campground});
      }
    });
  
  });
  
 router.post("/campgrounds/:id/comments",middleware.isLoggedIn,function(req,res){
   //lookup campground by id
   Campground.findById(req.params.id,function(err,campground){
    if(err){
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      //create new comment
      Comment.create(req.body.comment,function(err,comment){
        if(err){
          console.log(err);
        } else {
          //add userid and author to comment
          comment.author.id = req.user.id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          //connect comment with campground
          campground.comments.push(comment);
          campground.save();
          req.flash("success","Successfully added comment");
           //redirect somewhere else
           res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
   });
  });

  //comments update route

  router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwnership ,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
      if (err){
        res.redirect("back");
      } else {
        res.render("comments/edit",{campground_id : req.params.id, comment:foundComment});
      }
    });
 });

 router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
  Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
    if(err){
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
 });

 //Destroy routes
 router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
  Comment.findByIdAndRemove(req.params.comment_id,function(err){
    if(err){
      res.redirect("back");
    } else {
      req.flash("success","Deleted the comment");
      res.redirect("/campgrounds/" + req.params.id);
    }
  })
 });


  module.exports = router;
  