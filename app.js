var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");
var methodOverride = require("method-override");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");
var flash = require("connect-flash");

var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes    = require("./routes/comments"),
    indexRoutes       = require("./routes/index")
    
mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser : true, useUnifiedTopology: true}); //to connect to the mongo server
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

//PASSPORT CONFIG
app.use(require("express-session")({
  secret : "My name is Amisha",
  resave : false,
  saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.error= req.flash("error");
  res.locals.success = req.flash("success");

  next();
});

app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use(commentRoutes);

app.listen(3000,function(){
  console.log("YelpCamp app is running");
});