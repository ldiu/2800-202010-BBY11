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

app.use(session({
  secret: "password",
  resave: true,
  saveUninitialized: true
}));

if (IS_HEROKU) {
  mongoose.connect(uri);
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
    required: [true, "enter your name"]
  },
  lastName: {
    type: String,
    required: [true, "enter your last name"]
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
  if (req.session.loggedIn) {
    res.sendFile(__dirname + "/index2.html");
  }
  else {
    console.log("lol session");
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

// ---- app.post ----//

app.post("/userProfilePage.html", imageLoader.single("imageToUpload"), function (req, res) {

  const currentUser = BBY_11_user.updateOne({ email: req.session.email }, {
    $set: {
      name: req.body.userFirstName, lastName: req.body.userLastName, email: req.body.email, password: req.body.password, imagePath: "img/" + req.file.filename
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
        req.session.imagePath = "img/" + req.file.filename;
        res.redirect("/userProfilePage.html");
      }
    })

});

//Code follows Instructor Arron's "upload-file" example from 2537 course work. 
app.post('/saveImage', imageLoader.array("files"), function (req, res) {

  for (let i = 0; i < req.files.length; i++) {
    req.files[i].filename = req.files[i].originalname;
  }

});


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
            console.log("Error " + err);

          } else {

            req.session.save(function (err) { });
            res.redirect("/userProfilePage.html");

          }
        })

    } else if (req.body.text === "") {

      BBY_11_user.updateOne({ email: req.session.user.email }, {
        $push: {
          timeline: { text: req.body.text, date: req.body.date, images: [{ name: images[i].name, path: "img/" + images[i].path }]}
        }
      },

        function (err, data) {
          if (err) {
            console.log("Error " + err);

          } else {

            req.session.save(function (err) { });
            res.redirect("/userProfilePage.html");

          }
        })

    } else {

      BBY_11_user.updateOne({ email: req.session.user.email }, {
        $push: {
          timeline: { text: req.body.text, date: req.body.date, images: [{ name: images[i].name, path: "img/" + images[i].path }] }
        }
      },

        function (err, data) {
          if (err) {
            console.log("Error " + err);

          } else {

            req.session.save(function (err) { });
            res.redirect("/userProfilePage.html");

          }
        })
    }
  }
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

var id;

app.post("/search", function (req, res) {

  if (req.session.loggedIn) {
    BBY_11_user.find({ email: req.body.dashEmail }, function (err, users) {
      if (err) {
        console.log("the error: " + err);
        res.status(500).send();
      } else {
        var lol = req.body.dashEmail;
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

        id = req.session.searchUser;
        console.log(id);
      }
    });
  } else {
    res.redirect("/login.html");
  }
});

//---- updating ----//

app.post("/update", function (req, res) {
  if (req.session.loggedIn) {
    BBY_11_user.updateOne({ email: req.session.searchUser },
      { $set: { email: req.body.upEmail, password: req.body.upPassword, name: req.body.fName, lastName: req.body.lName } },
      function (err, users) {
        if (err) {
          console.log("there is an error");
          console.log(err);
        } else {
          console.log("email updated");
          res.redirect("/adminDash.html");
        }
      });
  } else {
    res.redirect("/login.html");
  }
});

//---- deleting ---//

app.post("/delete", function (req, res) {
  if (req.session.loggedIn) {
    BBY_11_user.deleteOne({ email: req.session.searchUser }, function (err, users) {
      if (err) {
        console.log("there is an error");
        console.log(err);
      } else {
        console.log("user deleted");
        res.redirect("/adminDash.html");
      }
    });
  } else {
    res.redirect("/login.html");
  }
});

//---- adding ----//

app.post("/add", function (req, res) {
  if (req.session.loggedIn) {
    BBY_11_user.insertMany({ email: req.body.adEmail, password: req.body.adPassword, name: req.body.adFname, lastName: req.body.adLname },
      function (err, users) {
        if (err) {
          console.log("there is an error");
          console.log(err);
        } else {
          let dbInfo = fs.readFileSync(__dirname + "/adminDash.html", "utf8");
          let changeToJSDOM = new JSDOM(dbInfo);
          if (changeToJSDOM.window.document.getElementById("val5").checked) {
            admin: true;
            res.redirect("/adminDash.html");
          } else if (changeToJSDOM.window.document.getElementById("val5").checked != true) {
            admin: false;
            res.redirect("/adminDash.html");
          } else {
            admin: false;
            res.redirect("/adminDash.html");
          }
        }
      });
  } else {
    res.redirect("/login.html");
  }
});

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

app.get('/getTimelinePosts', function (req, res) {
  BBY_11_user.findOne({ email: req.session.email }, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      res.send(user.timeline);
    }
  })
});

//Code follows Instructor Arron's "upload-file" example from 2537 course work. 
app.post('/saveImagePath', imageLoader.array("files"), function (req, res) {

  for (let index = 0; index < req.files.length; index++) {
    req.files[index].filename = req.files[index].originalname;
  }
});

app.post('/editOldPost', imageLoader.single("postImage"), function (req, res) {
  res.setHeader("Content-Type", "application/json");



  let images = req.body.images;
  for (let i = 0; i < images.length; i++) {


    if (images == "") {

      BBY_11_user.updateOne({ email: req.session.user.email, "timeline._id": req.body._id }, {
        $set: { "timeline.$.text": req.body.text, "timeline.$.date": req.body.date }
      },

        function (err, data) {
          if (err) {
            console.log("Error " + err);

          } else {

            req.session.save(function (err) { });
            res.redirect("/userProfilePage.html");

          }
        })
    } else {
      BBY_11_user.updateOne({ email: req.session.user.email, "timeline._id": req.body._id }, {
        $set: { "timeline.$.text": req.body.text, "timeline.$.date": req.body.date, "timeline.$.images": [{ name: images[i].name, path: "img/" + images[i].path }] }
      },

        function (err, data) {
          if (err) {
            console.log("Error " + err);

          } else {

            req.session.save(function (err) { });
            res.redirect("/userProfilePage.html");
          }
        })
    }
  }
});




app.post('/deleteOldPost', function (req, res) {
  res.setHeader("Content-Type", "application/json");
  console.log("deleteOldPost called");
  console.log(req.body);
  console.log(typeof req.body);

  BBY_11_user.updateOne({ email: req.session.user.email }, { $pull: { timeline: { _id: req.body._id } } },
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

app.listen(port, function () {
  console.log("server started on port " + port);
  let x = IS_HEROKU == 1 ? "remotely" : "locally";
  console.log("database conected " + x);
});