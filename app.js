"use strict";

const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const request = require("request");
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const { JSDOM } = require('jsdom');
const jsdom = require("jsdom");
const assert = require("assert");
const fs = require("fs");
const { ConnectionClosedEvent } = require("mongodb");
const { resolveSoa } = require("dns");
const port = process.env.PORT || 8000;
const uri = process.env.MONGODB_URI;
let dbConnection;
const IS_HEROKU = process.env.IS_HEROKU || false;
const url = "mongodb://localhost:27017/COMP2800";

const app = express();

//from arrons notes
const multer = require("multer");

//Resource retrieved from Instructor Arron's 2537 example "upload-app.js"
const imageStore = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/img")
  },
  filename: function (req, file, callback) {
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

if (IS_HEROKU) {
  MongoClient.connect(uri);
} else {
  mongoose.connect(url, { useNewUrlParser: true });
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
  name: {
    type: String,
    // required: [true, "enter your name"]
  },
  lastName: {
    type: String,
    // required: [true, "enter your last name"]
  },
  imagePath: {
    type: String
  },
  admin: {
    type: Boolean,
    default: false
  }
};

const BBY_11_user = new mongoose.model("BBY_11_user", usersSchema);


const admin1 = new BBY_11_user({
  email: "eliyahabibi@gmail.com",
  password: 123,
  name: "iliya",
  lastName: "habibi",
  admin: true
});

const admin2 = new BBY_11_user({
  email: "michaela@gmail.com",
  password: 123,
  name: "Michaela",
  lastName: "Ashlee",
  admin: true
});

const admin3 = new BBY_11_user({
  email: "liana@gmail.com",
  password: 123,
  name: "Liana",
  lastName: "Diu",
  admin: true
});
const admin4 = new BBY_11_user({
  email: "colin@gmail.com",
  password: 123,
  name: "Colin",
  lastName: "Lam",
  admin: true
});

// BBY_11_user.insertMany([admin1, admin2, admin3, admin4], function(err){
// if(err){
//   console.log(err);
// } else {
//   console.log("saved successfully");
// }
// });

// BBY_11_user.insertMany("/data.json", function(err){
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
  res.sendFile(__dirname + "/login.html");
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

app.get("/search.html", function (req, res) {
  if (req.session.users) {
    res.sendFile(__dirname + "/search.html");
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

//The following code follows 1537 course instructor's sessions example.
app.get("/userProfilePage.html", function (req, res) {

  if (req.session.loggedIn) {

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

//------- app.post -------//

app.post("/userProfilePage.html", function (req, resp) {

  BBY_11_user.updateOne({ email: req.session.email }, {
    $set: {
      name: req.body.userFirstName, lastName: req.body.userLastName, email: req.body.email, password: req.body.password
    }
  },

    function (err, data) {
      if (err) {
        console.log("Error " + err);

      } else {
        console.log("Data " + data);
        req.session.email = req.body.email;
        req.session.password = req.body.password;
        req.session.name = req.body.userFirstName;
        req.session.lastName = req.body.userLastName;
        resp.redirect("/userProfilePage.html");

      }
    })

});


app.post("/userProfileImage", imageLoader.single("imageToUpload"), function (req, res) {

  BBY_11_user.updateOne({ email: req.session.email }, {
    $set: {
      imagePath: "img/" + req.file.filename
    }
  },

    function (err, data) {
      if (err) {
        console.log("Error " + err);

      } else {
        console.log("Data " + data);
        req.session.imagePath = "img/" + req.file.filename;
        res.redirect("/userProfilePage.html");

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
  if (req.session.loggedIn) {

    BBY_11_user.find({}, function (err, users) {
      console.log("find()");
      if (err) {
        console.log("the error: " + err);
        res.status(500).send();
      } else {
        let dbInfo = fs.readFileSync(__dirname + "/adminDash.html", "utf8");
        let changeToJSDOM = new JSDOM(dbInfo);

        let str = "<table>";
        let t = users.forEach(function (user) {
          str += "<tr><td>email: " + user.email + "</td></tr><tr><td>name: " + user.name + "</tr></td>" +
            "<tr><td>lastName: " + user.lastName + "</tr></td><tr><td>isAdmin: " + user.admin + "</tr></td><tr><td><br></td></tr>";
        });
        str += "</table>";

        changeToJSDOM.window.document.getElementById("tableInfo").innerHTML = str;

        res.send(changeToJSDOM.serialize());
      }
    });
  } else {
    res.redirect("/login.html");
  }
});

//---- searching ----//

app.post("/search.html", function (req, res) {
  if (req.session.loggedIn) {
    BBY_11_user.find({ email: req.body.dashEmail }, function (err, users) {
      if (err) {
        console.log("the error: " + err);
        res.status(500).send();
      } else {
        let dbInfo = fs.readFileSync(__dirname + "/search.html", "utf8");
        let changeToJSDOM = new JSDOM(dbInfo);

        let str = "<table>";
        users.forEach(function (user) {
          str += "<tr><td>email: " + user.email + "</td></tr><tr><td>name: " + user.name + "</tr></td>" +
            "<tr><td>lastName: " + user.lastName + "</tr></td><tr><td>isAdmin: " + user.admin + "</tr></td><tr><td><br></td></tr>";
        });
        str += "</table>";

        changeToJSDOM.window.document.getElementById("searchUser").innerHTML = str;
        res.send(changeToJSDOM.serialize());
        console.log("user is printed");
      }
    });
  } else {
    res.redirect("/login.html");
  }
});

//---- updating ----//

app.post("/search.html", function (req, res) {
  if (req.session.loggedIn) {
    BBY_11_user.findOneAndUpdate({ email: req.body.dashEmail },
      { $set: { email: req.body.upEmail, password: req.body.upPassword, name: req.body.fName, lastName: req.body.lName } },
      function (err, users) {
        if (err) {
          // throw err;
          console.log("there is an error");
          console.log(err);
        } else {
          console.log("email updated");
          BBY_11_user.close();
        }
      });

  } else {
    res.redirect("/login.html");
  }
});

app.post("/search.html", function (req, res) {
  const dbInfo = fs.readFileSync(__dirname + "/search.html", "utf8");
  const changeToJSDOM = new JSDOM(dbInfo);
  if (req.session.loggedIn) {


  } else {
    res.redirect("/login.html");
  }
});

// app.post("/search.html", function (req, res) {
//   const dbInfo = fs.readFileSync(__dirname + "/search.html", "utf8");
//   const changeToJSDOM = new JSDOM(dbInfo);
//   if (req.session.loggedIn) {
//     BBY_11_user.findOneAndUpdate({ email: req.body.dashEmail },
//       { $set: { email: req.body.email, password: req.body.password, name: req.body.fName, lastName: req.body.lName } },
//       function (err, foundUser) {

//         if (err) {
//           console.log(err);
//         } else {
//           if (foundUser) {

//             let str = "<table>";
//             str += "<tr><td>email: " + foundUser.email + "</td></tr><tr><td>name: " + foundUser.name + "</tr></td>" +
//               "<tr><td>lastName: " + foundUser.lastName + "</tr></td><tr><td>isAdmin: " + foundUser.admin + "</tr></td><tr><td><br></td></tr>";
//             str += "</table>";

//             changeToJSDOM.window.document.getElementById("searchUser").innerHTML = str;

//             res.send(changeToJSDOM.serialize());

//           }
//         }
//       });

//   } else {
//     res.redirect("/login.html");
//   }
// });

app.post("/signUp.html", function (req, res) {
  const newUser = new BBY_11_user({
    email: req.body.emailBox,
    password: req.body.password,
    name: req.body.firstName,
    lastName: req.body.lastName,
    imagePath: "img/johndoe.png",
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
  let x = IS_HEROKU == 1 ? "remotely" : "locally";
  console.log("database conected " + x);
});