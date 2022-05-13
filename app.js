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
      callback(null, "./public/img") //do not store pdf and images on database...
  },
  filename: function(req, file, callback) { //pre-pended my-app-
      callback(null, file.originalname.split('/').pop().trim());
  } // destination and a callback and a file name and a callback. 
});

const imageLoader = multer({ storage: imageStore });

app.set("view engine", "html");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: "password",
  resave: false,
  saveUninitialized: true
}));

mongoose.connect("mongodb://localhost:27017/usersDB", { useNewUrlParser: true });

const usersSchema = {
  email: {
    type: String,
    required: [true, "enter your email"]
  },
  password: {
    type: String,
    required: [true, "enter your password"]
  },
  admin: {
    type: Boolean,
    default: false
  }
};

const Users = new mongoose.model("users", usersSchema);

var imageSchema = new mongoose.Schema({
  image: {
    data: Buffer,
    contentType: String
  },
  email: {
    type: String,
    required: [true, "enter your email"]
  },
});

const images = new mongoose.model("BBY_11_images", imageSchema);

const admin1 = new Users({
  email: "eliyahabibi@gmail.com",
  password: 123,
  admin: true
});

const admin2 = new Users({
  email: "michaela@gmail.com",
  password: 123,
  admin: true
});

const admin3 = new Users({
  email: "liana@gmail.com",
  password: 123,
  admin: true
});
const admin4 = new Users({
  email: "colin@gmail.com",
  password: 123,
  admin: true
});

// Users.insertMany([admin1, admin2, admin3, admin4], function (err) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("saved successfully");
//   }
// });

// Users.insertMany("/data.json", function (err) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("saved successfully");
//   }
// Users.insertMany([admin1, admin2, admin3, admin4], function(err){
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


    let userProfilePage = fs.readFileSync(__dirname + "/userProfilePage.html", "utf8");
    let changeToJSDOM = new JSDOM(userProfilePage);
    
    changeToJSDOM.window.document.getElementById("welcome").innerHTML = "<h2>Welcome to your profile " + req.session.email + "</h2>";
    changeToJSDOM.window.document.getElementById("userEmail").setAttribute("value", req.session.email);
    changeToJSDOM.window.document.getElementById("userPassword").setAttribute("value", req.session.password);

    res.send(changeToJSDOM.serialize());

  } else {
    res.redirect("/login.html");
  }

});

app.post("/userProfilePage.html", function (req, resp) {

  const currentUser = Users.updateOne({ email: req.session.email }, { $set: {
    email:req.body.email, password: req.body.password }},
    
    function(err, data){
      if (err){
        console.log("Error " + err);
        
      }else{
        console.log("Data "+ data);
        req.session.email = req.body.email;
        req.session.password = req.body.password;
        resp.redirect( "/userProfilePage.html");

      }
    })
    
});


app.post("/userProfileImage", imageLoader.single("imageToUpload"), function (req, res) {
  const imageObject = {
      userImage: {
          data: fs.readFileSync(__dirname + "/public/img/" + req.file.filename),
          contentType: "image"
      }
  }
  const newImage = new images({
      image: imageObject.userImage,
      email: req.session.email
  });
  newImage.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.sendFile(__dirname + "/index2.html");
    }
  });
});
 

app.post("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  req.session.destroy();
  res.redirect(__dirname + "/");
});

app.post("/adminDash.html", function (req, res) {
  Users.find(function(err, users){
    if(err){
      console.log(err);
    } else {
      res.send(users);
    }
  });
});

app.post("/signUp.html", function (req, res) {
  const newUser = new Users({
    email: req.body.emailBox,
    password: req.body.password,
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
  const isAdmin = Users.admin;

  Users.findOne({ email: username }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser && foundUser.admin === false) {
        if (foundUser.password === password) {
          req.session.user = foundUser;
          req.session.loggedIn = true;
          req.session.email = username;
          req.session.password = password;
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