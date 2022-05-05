const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const port = 3000;

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: "password",
  resave: false,
  saveUninitialized: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema = {
  email: {
    type: String,
    required: [true, "enter your email"]
  },
  password: {
    type: String,
    required: [true, "enter your password"]
  },
  admin:{
    type: Boolean,
    default: false
  }
};

const User = new mongoose.model("User", userSchema);

const admin1 = new User({
  email: "eliyahabibi@gmail.com",
  password: 123,
  admin: true
});

const admin2 = new User({
  email: "michaela@gmail.com",
  password: 123,
  admin: true
});

const admin3 = new User({
  email: "liana@gmail.com",
  password: 123,
  admin: true
});
const admin4 = new User({
  email: "colin@gmail.com",
  password: 123,
  admin: true
});

// User.insertMany([admin1, admin2, admin3, admin4], function(err){
// if(err){
//   console.log(err);
// } else {
//   console.log("saved successfully");
// }
// });

app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/logout", function(req, res){
  req.session.destroy();
  res.redirect("/");
});

app.post("/register", function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/secrets");
    }
  });
});

app.get("/secrets", (req, res)=>{
  if(req.session.user){
      res.render("secrets");
  }
  else {
    res.redirect('/login');
  }
})

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          req.session.user = foundUser;
          res.redirect("secrets");
        }
        if(foundUser.password === password && foundUser.admin === true){
          res.redirect("adminDash");
        }
      }
    }
  });
});


app.listen(port, function () {
  console.log("server started on port " + port);
});