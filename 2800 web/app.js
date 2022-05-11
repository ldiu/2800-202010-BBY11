const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const request = require("request");
const mongo = require("mongodb");
const mongoose = require("mongoose");
const { JSDOM } = require('jsdom');
const assert = require("assert");
const router = express.Router();
const fs = require("fs");
const port = 8000;

const app = express();

// app.set("view engine", "html");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: "password",
  resave: false,
  saveUninitialized: true
}));

const url = "mongodb://localhost:27017/BBY_11_user";

mongoose.connect(url, { useNewUrlParser: true });
//usersDB
//BBY_11_user

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
    // required: [true, "enter your name"]
  },
  lastName: {
    type: String,
    // required: [true, "enter your last name"]
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
  name: "iliya",
  lastName: "habibi",
  admin: true
});

const admin2 = new Users({
  email: "michaela@gmail.com",
  password: 123,
  name: "Michaela",
  lastName: "Ashlee",
  admin: true
});

const admin3 = new Users({
  email: "liana@gmail.com",
  password: 123,
  name: "Liana",
  lastName: "Diu",
  admin: true
});
const admin4 = new Users({
  email: "colin@gmail.com",
  password: 123,
  name: "Colin",
  lastName: "Lam",
  admin: true
});

// Users.insertMany([admin1, admin2, admin3, admin4], function(err){
// if(err){
//   console.log(err);
// } else {
//   console.log("saved successfully");
// }
// });

// Users.insertMany("/data.json", function(err){
// if(err){
//   console.log(err);
// } else {
//   console.log("saved successfully");
// }
// });


//------- app.get -------//

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/login.html", function (req, res) {
  if (req.session.users) {
    res.redirect(__dirname + "/index2.html");
  }
  else {
    res.sendFile(__dirname + "/login.html");
  }
});

app.get("/signUp.html", function (req, res) {
  res.sendFile(__dirname + "/signUp.html");
});

app.get("/adminDash.html", function (req, res) {
  if (req.session.users) {
    res.sendFile(__dirname + "/adminDash.html");
  }
  else {
    res.redirect("/login.html");
  }
});

app.get("/index2.html", (req, res) => {
  if (req.session.users) {
    res.sendFile(__dirname + "/index2.html");
  }
  else {
    res.redirect("/login.html");
  }
});

app.get("/data", function (req, res) {
  res.sendFile(__dirname + "/data.html");
  Users.find(function (err, users) {
    if (err) {
      console.log("the error: " + err);
    } else {
     let userData = [];
     mongo.connect(url, function(err, db){
      assert.equal(null, err);
      let currentData = db.collection("BBY_11_user").find({email:{}, name:{}});
      currentData.forEach(function(doc, err){
        assert.equal(null, err);
        userData.push(doc);
      }, function(){
        db.close();
        res.sendFile();
      });
     });
    }
  });

});

/**
   let t = users.forEach(function (user) {
        let str = "<table>";
        res.write(str += "<tr><td>email: " + user.email + "</tr></td><tr><td>name: " + user.name + "</tr></td></table>");
      });
 */

//------- app.post -------//

app.post("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("data", function (req, res) {

});

// app.post("/", function (req, res) {
//   req.session.destroy();
//   res.redirect(__dirname + "/");
// });

app.post("/adminDash.html", function (req, res) {
  Users.find({}, function (err, users) {
    if (err) {
      console.log("the error: " + err);
      res.status(500).send();
    } else {
    
      // let userData = [];
      // mongo.connect(url, function(err, db){
      //  assert.equal(null, err);
      //  let currentData = db.collection("BBY_11_user").find({email:{}, name:{}});
      //  currentData.forEach(function(doc, err){
      //    assert.equal(null, err);
      //    userData.push(doc);
      //  }, function(){
      //    db.close();
      //    res.sendFile(__dirname + "/adminDash.html", {tableInfo: userData});
      //  });
      // });

      // res.sendFile(__dirname + "/data.html");
    }
  });
});

app.post("/signUp.html", function (req, res) {
  const newUser = new Users({
    email: req.body.emailBox,
    password: req.body.password,
    name: req.body.name,
    lastName: req.body.lastName,
    isAdmin: false
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
        } else {
          document.getElementById("container3").addEventListener("submit", function (e) {
            if (foundUser.password != password) {
              e.preventDefault();
              document.getElementById("container2").innerText = "your password or email is wrong!";
            }
          });
        }

      }
      if (foundUser && foundUser.admin === true) {
        if (foundUser.password === password && foundUser.admin != isAdmin) {
          req.session.users = foundUser;
          res.sendFile(__dirname + "/adminDash.html");
        }
        if (foundUser.password != password && foundUser.admin != isAdmin) {
          res.send("incorrect email or password!");
          res.redirect("/login.html");
        }
      }
    }
  });
});


app.listen(port, function () {
  console.log("server started on port " + port);
});