"use strict";

const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const request = require("request");
const { MongoClient, ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const { JSDOM } = require('jsdom');
const jsdom = require("jsdom");
const assert = require("assert");
const fs = require("fs");
const { ConnectionClosedEvent } = require("mongodb");
const { resolveSoa } = require("dns");
const port = process.env.PORT || 8000;
const uri = process.env.MONGODB_URI;
const IS_HEROKU = process.env.IS_HEROKU || false;
const url = "mongodb://localhost:27017/COMP2800";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));


//------- Use of Multer -------//

const multer = require("multer");

/* Use of Multer
 * This block of code was adapted from Instructor Arron Ferguson's
 * "upload-app.js" example from 2537 course work. It uses multer
 * to store images.
 */
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



//------- Creating a session -------//

app.use(session({
  secret: "password",
  resave: true,
  saveUninitialized: true
}));



//------- Connecting to mongoose -------//

if (IS_HEROKU) {
  mongoose.connect(uri);
} else {
  mongoose.connect(url, { useNewUrlParser: true });
}


//------- Creating user schema -------//

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
    type: String
  },
  lastName: {
    type: String
  },
  imagePath: {
    type: String
  },

  timeline: [{
    text: {
      type: String
    },
    date: {
      type: Date
    },
    images: [{
      name: {
        type: String
      },
      path: {
        type: String
      }
    }]
  }],
  admin: {
    type: Boolean,
    default: false
  }
};

const BBY_11_user = new mongoose.model("BBY_11_user", usersSchema);



//------- Creating admins to run on local host -------//

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


//------- Inserting admins to database -------//


/* NOTE: please run this once and then comment it out. It will continue
         to insert into the database otherwise.
*/ 
BBY_11_user.insertMany([admin1, admin2, admin3, admin4], function(err){
  if(err){
    console.log(err);
  } else {
    console.log("saved successfully");
  }
  });


//------- app.get all pages section -------//

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/index.html", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/login.html", function (req, res) {
  res.sendFile(__dirname + "/login.html");
});

app.get("/signUp.html", function (req, res) {
  res.sendFile(__dirname + "/signUp.html");
});

app.get("/passRecov.html", function (req, res) {
  res.sendFile(__dirname + "/passRecov.html");
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
  if (req.session.loggedIn) {
    res.sendFile(__dirname + "/index2.html");
  }
  else {
    res.redirect("/login.html");
  }
});

app.get("/userProfilePage.html", (req, res) => {
  if (req.session.loggedIn) {
    res.sendFile(__dirname + "/userProfilePage.html");
  }
  else {
    res.redirect("/login.html");
  }
});

app.get("/about.html", function (req, res) {
  res.sendFile(__dirname + "/about.html");
});

app.get("/errorRedirect.html", function (req, res) {
  ews.sendFile(__dirname + "/errorRedirect.html");
});



// ---- app.post section----//

// ---- the following code is for ending the session ----//

app.post("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
  req.session.loggedIn = false;
  console.log(req.session.loggedIn);
  req.session.destroy();
});



// ---- The following code is for admin to display all users ----//

app.post("/adminDash.html", function (req, res) {
  if (req.session.loggedIn) {
    BBY_11_user.find({}, function (err, users) {
      console.log("find()");
      if (err) {
        console.log("Error:\n" + err);
        res.redirect("/errorRedirect.html");
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



// ---- The following code is for admin to search a user ----//

app.post("/search", function (req, res) {
  if (req.session.loggedIn) {
    BBY_11_user.find({ email: req.body.dashEmail }, function (err, users) {
      if (err) {
        console.log("Error:\n" + err);
        res.redirect("/errorRedirect.html");
      } else {
        if (users) {
          let dbInfo = fs.readFileSync(__dirname + "/adminDash.html", "utf8");
          let changeToJSDOM = new JSDOM(dbInfo);

          let str = "<table>";
          users.forEach(function (user) {
            str += "<tr><td>email: " + user.email + "</td></tr><tr><td>name: " + user.name + "</tr></td>" +
              "<tr><td>lastName: " + user.lastName + "</tr></td><tr><td>isAdmin: " + user.admin + "</tr></td><tr><td><br></td></tr>";
          });
          str += "</table>";

          changeToJSDOM.window.document.getElementById("searchUser").innerHTML = str;
          res.send(changeToJSDOM.serialize());
          console.log("user printed");

          req.session.searchUser = req.body.dashEmail;
          req.session.save();
        } else {
          let dbInfo = fs.readFileSync(__dirname + "/adminDash.html", "utf8");
          let changeToJSDOM = new JSDOM(dbInfo);

          let str = "<table><tr><td>Account not found!</td></tr></td>";
          changeToJSDOM.window.document.getElementById("searchUser").innerHTML = str;
          changeToJSDOM.window.document.getElementById("searchUser").style.color = "#d50000";
          res.send(changeToJSDOM.serialize());
          console.log("no user found");
        }
      }
    });
  } else {
    res.redirect("/login.html");
  }
});



// ---- The following code is for admin to update any user ----//

app.post("/update", function (req, res) {
  if (req.session.loggedIn) {
    BBY_11_user.updateOne({ email: req.session.searchUser },
      { $set: { email: req.body.upEmail, password: req.body.upPassword, name: req.body.fName, lastName: req.body.lName } },
      function (err, users) {
        if (err) {
          console.log("Error\n:" + err);
          res.redirect("/errorRedirect.html");
        } else {
          res.redirect("/adminDash.html");
        }
      });
  } else {
    res.redirect("/login.html");
  }
});



// ---- The following code is for admin to delete a user ----//

app.post("/delete", function (req, res) {
  if (req.session.loggedIn) {
    BBY_11_user.deleteOne({ email: req.session.searchUser }, function (err, users) {
      if (err) {
        console.log("Error:\n" + err);
        res.redirect("/errorRedirect.html");
      } else {
        console.log("user deleted");
        res.redirect("/adminDash.html");
      }
    });
  } else {
    res.redirect("/login.html");
  }
});



// ---- The following code is for admin to add a new user ----//

app.post("/add", function (req, res) {
  if (req.session.loggedIn) {
    BBY_11_user.insertMany({ email: req.body.adEmail, password: req.body.adPassword, name: req.body.adFname, lastName: req.body.adLname, admin: req.body.isAdmin },
      function (err, users) {
        if (err) {
          console.log("Error:\n" + err);
          res.redirect("/errorRedirect.html");
        } else {
          let dbInfo = fs.readFileSync(__dirname + "/adminDash.html", "utf8");
          let changeToJSDOM = new JSDOM(dbInfo);

          if (changeToJSDOM.window.document.getElementById("val5").checked == true) {
            isAdmin = true;
            res.redirect("/adminDash.html");

          } else if (changeToJSDOM.window.document.getElementById("val6").checked == true) {
            isAdmin = false;
            res.redirect("/adminDash.html");
          } else {
            BBY_11_user.admin = false;
            res.redirect("/adminDash.html");
          }
        }
      });
  } else {
    res.redirect("/login.html");
  }
});



// ---- The following code is for reseting the user's password ----//

app.post("/accountSearch", function (req, res) {
  BBY_11_user.findOne({ email: req.body.emailRecov }, function (err, user) {
    if (err) {
      console.log("Error:\n" + err);
      res.redirect("/errorRedirect.html");
    } else {
      if (user) {
        let dbInfo = fs.readFileSync(__dirname + "/passRecov.html", "utf8");
        let changeToJSDOM = new JSDOM(dbInfo);

        let str = "<table><tr><td>Account Found!</td></tr></td>";
        changeToJSDOM.window.document.getElementById("found").innerHTML = str;
        changeToJSDOM.window.document.getElementById("found").style.color = "#15ec01";
        res.send(changeToJSDOM.serialize());

        req.session.found = req.body.emailRecov;
        req.session.save();

        app.post("/updatePass", function (req, res) {
          BBY_11_user.updateOne({ email: req.session.found }, { $set: { password: req.body.newPass } },
            function (err, user) {
              if (err) {
                console.log(err);
              } else {
                console.log("pass updated");
                res.redirect("/login.html");
              }
            });
        });
      }
      if (!user) {
        let dbInfo = fs.readFileSync(__dirname + "/passRecov.html", "utf8");
        let changeToJSDOM = new JSDOM(dbInfo);

        let str = "<table><tr><td>Account not found!</td></tr></td>";
        changeToJSDOM.window.document.getElementById("found").innerHTML = str;
        changeToJSDOM.window.document.getElementById("found").style.color = "#d50000";
        res.send(changeToJSDOM.serialize());
      }
    }
  });
});



// ---- The following code is for User Sign Up ----//

app.post("/signUp.html", function (req, res) {
  const newUser = new BBY_11_user({
    email: req.body.emailBox,
    password: req.body.password,
    name: req.body.firstName,
    lastName: req.body.lastName,
    imagePath: "img/johndoe.png",
    admin: false
  });

  newUser.save(function (err) {
    if (err) {
      console.log("Error:\n" + err);
      res.redirect("/errorRedirect.html");
    } else {
      res.sendFile(__dirname + "/login.html");
    }
  });
});



// ---- The following code is for Loggin In ----//

app.post("/login.html", function (req, res) {
  const username = req.body.emailBox;
  const password = req.body.password;
  const isAdmin = BBY_11_user.admin;

  BBY_11_user.findOne({ email: username }, function (err, foundUser) {
    if (err) {
      console.log("Error:\n" + err);
      res.redirect("/errorRedirect.html");
    } else {
      // console.log("found THE user", foundUser);
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
        if (foundUser.password != password) {
          let dbInfo = fs.readFileSync(__dirname + "/login.html", "utf8");
          let changeToJSDOM = new JSDOM(dbInfo);
          let str = "<table><tr><td>Invalid username or password</td></tr></td>";
          changeToJSDOM.window.document.getElementById("msg").innerHTML = str;
          res.send(changeToJSDOM.serialize());
          console.log("invalid useranme or pass");
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
        if (foundUser.password != password && foundUser.admin != isAdmin) {
          let dbInfo = fs.readFileSync(__dirname + "/login.html", "utf8");
          let changeToJSDOM = new JSDOM(dbInfo);
          let str = "<table><tr><td>Invalid username or password</td></tr></td>";
          changeToJSDOM.window.document.getElementById("msg").innerHTML = str;
          res.send(changeToJSDOM.serialize());
          console.log("invalid useranme or pass");
        }
      }

      if (!foundUser) {
        let dbInfo = fs.readFileSync(__dirname + "/login.html", "utf8");
        let changeToJSDOM = new JSDOM(dbInfo);
        let str = "<table><tr><td>Account not Found</td></tr></td>";
        changeToJSDOM.window.document.getElementById("msg").innerHTML = str;
        res.send(changeToJSDOM.serialize());
        console.log("account not found");
      }
    }
  });
});



// ---- The following code is for User Profile Information ----//


// ---- Get user Information ----//

app.get('/getUserInfo', function (req, res) {
  BBY_11_user.findOne({ email: req.session.email }, function (err, user) {
    if (err) {
      console.log("Error:\n" + err);
      res.redirect("/errorRedirect.html");
    } else {
      res.send(user);
    }
  })
});


// ---- Save Profile Images ----//

/* Save Profile Image
 * This saveProfileImage block of code was adapted from Instructor Arron Ferguson's
 * "upload-app.js" example from 2537 course work for iterating through several images.
 */
app.post('/saveProfileImage', imageLoader.array("files"), function (req, res) {

  for (let index = 0; index < req.files.length; index++) {
    req.files[index].filename = req.files[index].originalname;
  }
});


// ---- Edit User Info ----//

app.post("/editUserInfo", imageLoader.single("imageToUpload"), function (req, res) {
  res.setHeader("Content-Type", "application/json");


  if (req.body.imagePath === "") {
    BBY_11_user.updateOne({ email: req.session.email }, {
      $set: { email: req.body.email, password: req.body.password, name: req.body.name, lastName: req.body.lastName }
    },

      function (err, data) {
        if (err) {
          console.log("Error:\n" + err);
          res.redirect("/errorRedirect.html");
        } else {
          req.session.email = req.body.email;
          req.session.save(function (err) { });
          res.redirect("/userProfilePage.html");
        }
      });
  } else {

    BBY_11_user.updateOne({ email: req.session.email }, {
      $set: { email: req.body.email, password: req.body.password, name: req.body.name, lastName: req.body.lastName, imagePath: req.body.imagePath }
    },
      function (err, data) {
        if (err) {
          console.log("Error:\n" + err);
          res.redirect("/errorRedirect.html");
        } else {
          req.session.email = req.body.email;
          req.session.save(function (err) { });
          res.redirect("/userProfilePage.html");
        }
      });
  }
}
);



// ---- The following code is for User Profile Timeline ----//


// ---- Save Image after creating post ----//

/* Save Image
 * This saveImage block of code was adapted from Instructor Arron Ferguson's
 * "upload-app.js" example from 2537 course work for iterating through several images.
 */
app.post('/saveImage', imageLoader.array("files"), function (req, res) {
  for (let i = 0; i < req.files.length; i++) {
    req.files[i].filename = req.files[i].originalname;
  }
});


// ---- Create new timeline post ----//

app.post("/createNewPost", imageLoader.single("fileImage"), function (req, res) {
  res.setHeader("Content-Type", "application/json");

  let images = req.body.images;
  console.log(req.body.images);
  console.log("This is the text" + req.body.text);

  for (let i = 0; i < images.length; i++) {
    if (images === "") {
      BBY_11_user.updateOne({ email: req.session.user.email }, {
        $push: {
          timeline: { text: req.body.text, date: req.body.date }
        }
      },
        function (err, data) {
          if (err) {
            console.log("Error:\n" + err);
            res.redirect("/errorRedirect.html");
          } else {
            req.session.save(function (err) { });
            res.redirect("/userProfilePage.html");
          }
        });
    } else if (req.body.text === "") {
      BBY_11_user.updateOne({ email: req.session.user.email }, {
        $push: {
          timeline: { text: req.body.text, date: req.body.date, images: [{ name: images[i].name, path: "img/" + images[i].path }] }
        }
      },
        function (err, data) {
          if (err) {
            console.log("Error " + err);
            res.redirect("/errorRedirect.html");
          } else {
            req.session.save(function (err) { });
            res.redirect("/userProfilePage.html");
          }
        });
    } else {
      BBY_11_user.updateOne({ email: req.session.user.email }, {
        $push: {
          timeline: { text: req.body.text, date: req.body.date, images: [{ name: images[i].name, path: "img/" + images[i].path }] }
        }
      },
        function (err, data) {
          if (err) {
            console.log("Error:\n" + err);
            res.redirect("/errorRedirect.html");
          } else {
            req.session.save(function (err) { });
            res.redirect("/userProfilePage.html");
          }
        });
    }
  }
});


// ---- Get timeline posts ----//

app.get('/getTimelinePosts', function (req, res) {
  BBY_11_user.findOne({ email: req.session.email }, function (err, user) {
    if (err) {
      console.log("Error:\n" + err);
      res.redirect("/errorRedirect.html");
    } else {
      res.send(user.timeline);
    }
  });
});



// ---- Save updated images to folder ----//

/* Save Images Path
 * This saveImagePath block of code was adapted from Instructor Arron Ferguson's
 * "upload-app.js" example from 2537 course work for iterating through several images.
 */
app.post('/saveImagePath', imageLoader.array("files"), function (req, res) {
  for (let index = 0; index < req.files.length; index++) {
    req.files[index].filename = req.files[index].originalname;
  }
});



// ---- Update timeline Posts ----//

app.post('/editOldPost', imageLoader.single("postImage"), function (req, res) {
  res.setHeader("Content-Type", "application/json");

  let imageName = req.body.images[0].name;
  let images = req.body.images;
  for (let i = 0; i < images.length; i++) {
    if (imageName == "" && req.body.text == "") {
    } else if (images[0].name == "") {
      BBY_11_user.updateOne({ email: req.session.user.email, "timeline._id": req.body._id }, {
        $set: { "timeline.$.text": req.body.text, "timeline.$.date": req.body.date }
      },
        function (err, data) {
          if (err) {
            console.log("Error:\n" + err);
            res.redirect("/errorRedirect.html");
          } else {
            req.session.save(function (err) { });
            res.redirect("/userProfilePage.html");
          }
        });
    } else if (req.body.text == "") {
      BBY_11_user.updateOne({ email: req.session.user.email, "timeline._id": req.body._id }, {
        $set: { "timeline.$.date": req.body.date, "timeline.$.images": [{ name: images[i].name, path: "img/" + images[i].path }] }
      },
        function (err, data) {
          if (err) {
            console.log("Error:\n" + err);
            res.redirect("/errorRedirect.html");
          } else {
            req.session.save(function (err) { });
            res.redirect("/userProfilePage.html");
          }
        });
    } else {
      BBY_11_user.updateOne({ email: req.session.user.email, "timeline._id": req.body._id }, {
        $set: { "timeline.$.text": req.body.text, "timeline.$.date": req.body.date, "timeline.$.images": [{ name: images[i].name, path: "img/" + images[i].path }] }
      },
        function (err, data) {
          if (err) {
            console.log("Error:\n" + err);
            res.redirect("/errorRedirect.html");
          } else {
            req.session.save(function (err) { });
            res.redirect("/userProfilePage.html");
          }
        });
    }
  }
});


// ---- Delete timeline Posts ----//

app.post('/deleteOldPost', function (req, res) {
  res.setHeader("Content-Type", "application/json");
  console.log("deleteOldPost called");
  console.log(req.body);
  console.log(typeof req.body);

  BBY_11_user.updateOne({ email: req.session.email }, { $pull: { timeline: { _id: req.body._id } } },
    function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        req.session.save(function (err) { });
        res.redirect("/userProfilePage.html");
        console.log("deleteOldPost Complete!");
      }
    })
});


// ---- The following code is for connecting to port 8000 ----//

app.listen(port, function () {
  console.log("server started on port " + port);
  let x = IS_HEROKU == 1 ? "remotely" : "locally";
  console.log("database conected " + x);
});