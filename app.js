const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const request = require("request");
const mongoose = require("mongoose");
const fs = require("fs");
const req = require("express/lib/request");
const jsdom = require("jsdom");
const { ConnectionClosedEvent } = require("mongodb");
const { JSDOM } = jsdom;
const port = process.env.PORT || 3000;

const app = express();

//from arrons notes
const multer = require("multer");

//Resource retrieved from Instructor Arron's 2537 example "upload-app.js"
const imageStore = multer.diskStorage({
  destination: function (req, file, callback) {
      callback(null, "./public/img") 
  },
  filename: function(req, file, callback) { 
      callback(null, file.originalname.split('/').pop().trim());
  }  
});

const imageLoader = multer({ storage: imageStore });

app.set("view engine", "html");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: "password",
  resave: true,
  saveUninitialized: true
}));

mongoose.connect("mongodb://localhost:27017/COMP2800", { useNewUrlParser: true });

const usersSchema = {
  email: {
    type: String,
    required: [true, "enter your email"]
  },
  password: {
    type: String,
    required: [true, "enter your password"]
  },
  name: {
    type: String,
    required: [true, "enter your name"]
  },
  lastName: {
    type: String,
    required: [true, "enter your last name"]
  },
  imagePath: {
    type: String
  },
  admin: {
    type: Boolean,
    default: false
  }
};

const BBY_11_user = new mongoose.model("bby_11_user", usersSchema);


const admin1 = new BBY_11_user({
  email: "eliyahabibi@gmail.com",
  password: 123,
  admin: true
});

const admin2 = new BBY_11_user({
  email: "michaela@gmail.com",
  password: 123,
  admin: true
});

const admin3 = new BBY_11_user({
  email: "liana@gmail.com",
  password: 123,
  admin: true
});
const admin4 = new BBY_11_user({
  email: "colin@gmail.com",
  password: 123,
  admin: true
});

// BBY_11_user.insertMany([admin1, admin2, admin3, admin4], function (err) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("saved successfully");
//   }
// });

// BBY_11_user.insertMany("/data.json", function (err) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("saved successfully");
//   }
// BBY_11_user.insertMany([admin1, admin2, admin3, admin4], function(err){
// if(err){
//   console.log(err);
// } else {
//   console.log("saved successfully");
// }
// });


app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/adminDash.html", function (req, res) {
  res.sendFile(__dirname + "/adminDash.html");
});

app.get("/login.html", function (req, res) {
  res.sendFile(__dirname + "/login.html");
});

app.get("/signUp.html", function (req, res) {
  res.sendFile(__dirname + "/signUp.html");
});

app.get("/adminDash.html", function (req, res) {
  res.sendFile(__dirname + "/adminDash.html");
});

app.get("/index2.html", (req, res) => {
  if (req.session.users) {
    res.sendFile(__dirname + "/index2.html");
  }
  else {
    res.redirect("/login.html");
  }
});

//The following code follows 1537 course instructor's sessions example.
app.get("/userProfilePage.html", function (req, res) {

  if (req.session.loggedIn) {

    // console.log(images.findOne({email: req.session.email}));


    let userProfilePage = fs.readFileSync(__dirname + "/userProfilePage.html", "utf8");
    let changeToJSDOM = new JSDOM(userProfilePage);
    
    changeToJSDOM.window.document.getElementById("welcome").innerHTML = "<h2>Welcome to your profile " + req.session.name + "</h2>";
    changeToJSDOM.window.document.getElementById("userFirstName").setAttribute("value", req.session.name);
    changeToJSDOM.window.document.getElementById("userLastName").setAttribute("value", req.session.lastName);
    changeToJSDOM.window.document.getElementById("userEmail").setAttribute("value", req.session.email);
    changeToJSDOM.window.document.getElementById("userPassword").setAttribute("value", req.session.password);
    changeToJSDOM.window.document.getElementById("profileImage").src = req.session.imagePath;



    res.send(changeToJSDOM.serialize());

  } else {
    res.redirect("/login.html");
  }

});

app.post("/userProfilePage.html", function (req, resp) {

  const currentUser = BBY_11_user.updateOne({ email: req.session.email }, { $set: {
    name: req.body.userFirstName, lastName: req.body.userLastName, email: req.body.email, password: req.body.password }},
    
    function(err, data){
      if (err){
        console.log("Error " + err);
        
      }else{
        console.log("Data "+ data);
        req.session.email = req.body.email;
        req.session.password = req.body.password;
        req.session.name = req.body.userFirstName;
        req.session.lastName = req.body.userLastName;
        resp.redirect( "/userProfilePage.html");

      }
    })
    
});


app.post("/userProfileImage", imageLoader.single("imageToUpload"), function (req, res) {
  
  const currentUser = BBY_11_user.updateOne({ email: req.session.email }, { $set: {
    imagePath: "img/" + req.file.filename}},
    
    function(err, data){
      if (err){
        console.log("Error " + err);
        
      }else{
        console.log("Data "+ data);
        req.session.imagePath = "img/" + req.file.filename;
        res.redirect( "/userProfilePage.html");

      }
    })
    
});
 

app.post("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  req.session.destroy();
  res.redirect(__dirname + "/");
});

app.post("/adminDash.html", function (req, res) {
  BBY_11_user.find(function(err, users){
    if(err){
      console.log(err);
    } else {
      res.send(users);
    }
  });
});

app.post("/signUp.html", function (req, res) {
  const newUser = new BBY_11_user({
    email: req.body.emailBox,
    password: req.body.password,
    name: req.body.firstName,
    lastName: req.body.lastName,
    imagePath: "img/johndoe.png",
    isAdmin : false
  });

  newUser.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.sendFile(__dirname + "/index2.html");
    }
  });
});


app.post("/login.html", function (req, res) {
  const username = req.body.emailBox;
  const password = req.body.password;
  // const firstName = req.body.name;
  const isAdmin = BBY_11_user.admin;

  BBY_11_user.findOne({ email: username }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser && foundUser.admin === false) {
        if (foundUser.password === password) {
          req.session.user = foundUser;
          req.session.loggedIn = true;
          req.session.email = username;
          req.session.password = password;
          req.session.name = foundUser.name;
          req.session.lastName = foundUser.lastName;
          req.session.imagePath = foundUser.imagePath;
    
          res.sendFile(__dirname + "/index2.html");
        }
      }
      if (foundUser && foundUser.admin === true) {
        if (foundUser.password === password && foundUser.admin != isAdmin) {
          req.session.users = foundUser;
          req.session.loggedIn = true;
          req.session.email = username;
          req.session.password = password;
          res.sendFile(__dirname + "/adminDash.html");
        }
      }
    }
  });
});


app.listen(port, function () {
  console.log("server started on port " + port);
});