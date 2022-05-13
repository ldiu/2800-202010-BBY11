const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const request = require("request");
const mongoose = require("mongoose");
const port = process.env.PORT || 8000;
const uri = process.env.MONGODB_URI;
const { MongoClient } = require('mongodb');
let dbConnection;
const IS_HEROKU = process.env.IS_HEROKU || false;

const app = express();

app.set("view engine", "html");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: "password",
  resave: false,
  saveUninitialized: true
}));

if (IS_HEROKU){
  MongoClient.connect(uri);
} else {
  mongoose.connect("mongodb://localhost:27017/usersDB", { useNewUrlParser: true });
}

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

const Users = new mongoose.model("Users", usersSchema);

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

app.post("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

// app.post("/", function (req, res) {
//   req.session.destroy();
//   res.redirect(__dirname + "/");
// });

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
          res.sendFile(__dirname + "/index2.html");
        }
      } 
      if(foundUser && foundUser.admin === true){
        if (foundUser.password === password && foundUser.admin != isAdmin) {
          req.session.users = foundUser;
          res.sendFile(__dirname + "/adminDash.html");
        }
      }
    }
  });
});


app.listen(port, function () {
  console.log("server started on port " + port);
  let x = IS_HEROKU == 1 ? "remotely" : "locally";
  console.log("database conected " + x);
});