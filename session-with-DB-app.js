
const express = require("express");
const session = require("express-session");
const app = express();
const fs = require("fs");
const { JSDOM } = require('jsdom');

// static path mappings
app.use("/js", express.static("public/js"));
app.use("/css", express.static("public/css"));
app.use("/img", express.static("public/imgs"));
app.use("/fonts", express.static("public/fonts"));
app.use("/html", express.static("public/html"));
app.use("/media", express.static("public/media"));


app.use(session(
  {
    secret: "extra text that no one will guess",
    name: "S.I.V.ASessionID",
    resave: false,
    saveUninitialized: true
  })
);



app.get("/", function (req, res) {

  if (req.session.loggedIn) {
    res.redirect("/main");
  } else {

    let doc = fs.readFileSync("./app/html/index.html", "utf8");

    res.set("Server", "S.I.V.A Engine");
    res.set("X-Powered-By", "S.I.V.A");
    res.send(doc);

  }

});


app.get("/main", function (req, res) {

  // check for a session first!
  if (req.session.loggedIn) {

    let main = fs.readFileSync("./app/html/main.html", "utf8");
    let mainDOM = new JSDOM(main);

    //table 2
    const mysql = require("mysql2");
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "destiny"
    });
    connection.connect();
    connection.query(
      //'SELECT * FROM stats',
      "SELECT * FROM stats",
      function (error, results2, fields) {
        // results is an array of records, in JSON format
        // fields contains extra meta data about results
        console.log("Results from DB", results2, "and the # of records returned", results2.length);

        if (error) {
          // in production, you'd really want to send an email to admin but for now, just console
          console.log(error);
        }
        let str = "<table>";
        for (let i = 0; i < results2.length; i++) {
          str += "<tr><td>Your weapon is " + results2[i].weapon + "</td></tr>";
          str += "<tr><td>You are a " + results2[i].userClass + "</td></tr>";
          str += "<tr><td>you are the famous " + results2[i].supers + " user</td></tr>";
          str += "<tr><td>achievement: " + results2[i].achievement + "</td></tr>";
          str += "<tr><td>You are an " + results2[i].type + "</td></tr>";
          str += "<tr><td>You have " + results2[i].pet + "as your pet</td></tr>";
        }
        str += "</table>"
        mainDOM.window.document.getElementById("table2").innerHTML
          = str;
        // great time to get the user's data and put it into the page!

        mainDOM.window.document.getElementsByTagName("title")[0].innerHTML
          = req.session.name + "'s Profile";
        mainDOM.window.document.getElementById("userName").innerHTML
          = "Welcome back " + req.session.name + ".<br>S.I.V.A is in control.<br>There is no escape!"
          + "<br>We know everything about everyone!<br>You all will fall just like Iron Lords!<br>Spoiler:"
          + "<br>Second collaps is coming<br>There is no escape!<br><br>";



        mainDOM.window.document.getElementById("content1").innerHTML
          = "Your name is :  " + req.session.name;
        mainDOM.window.document.getElementById("content2").innerHTML
          = "Your email is :  " + req.session.email;
        mainDOM.window.document.getElementById("content3").innerHTML
          = "Your password is :  " + req.session.password;
        mainDOM.window.document.getElementById("content4").innerHTML
          = "Your favorite color is :  " + req.session.color;
        mainDOM.window.document.getElementById("content5").innerHTML
          = "Your belong to :  " + req.session.city;
        mainDOM.window.document.getElementById("content6").innerHTML
          = "Your favorite food  is :  " + req.session.food;

        res.set("Server", "S.I.V.A Engine");
        res.set("X-Powered-By", "S.I.V.A");
        res.send(mainDOM.serialize());

      }
    );
    connection.end();

  } else {
    // not logged in - no session and no access, redirect to home!
    res.redirect("/");
  }

});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Notice that this is a "POST"
app.post("/login", function (req, res) {
  res.setHeader("Content-Type", "application/json");


  console.log("What was sent", req.body.email, req.body.password);


  let results = authenticate(req.body.email, req.body.password,
    function (userRecord) {
      //console.log(rows);
      if (userRecord == null) {
        // server couldn't find that, so use AJAX response and inform
        // the user. when we get success, we will do a complete page
        // change. Ask why we would do this in lecture/lab :)
        res.send({ status: "fail", msg: "User account not found." });
      } else {
        // authenticate the user, create a session
        req.session.loggedIn = true;
        req.session.email = userRecord.email;
        req.session.name = userRecord.name;
        req.session.password = userRecord.password;
        req.session.color = userRecord.color;
        req.session.city = userRecord.city;
        req.session.food = userRecord.food;
        // req.session.lore1 = userRecord.lore1;

        req.session.save(function (err) {
          // session saved, for analytics, we could record this in a DB
        });
        // all we are doing as a server is telling the client that they
        // are logged in, it is up to them to switch to the profile page
        res.send({ status: "success", msg: "Logged in." });
      }
    });

  let results2 =
    function (statRecord) {
      //console.log(rows);

      // server couldn't find that, so use AJAX response and inform
      // the user. when we get success, we will do a complete page
      // change. Ask why we would do this in lecture/lab :)
      // res.send({ status: "fail", msg: "data not found" });

      // authenticate the user, create a session
      if (req.session.loggedIn = true) {
        req.session.weapon = statRecord.weapon;
        console.log("we are here");
        req.session.userClass = statRecord.userClass;
        req.session.supers = statRecord.supers;
        req.session.color = statRecord.achievement;
        req.session.city = statRecord.type;
        req.session.food = statRecord.pet;
      }

      req.session.save(function (err) {
        // session saved, for analytics, we could record this in a DB
      });
      // all we are doing as a server is telling the client that they
      // are logged in, it is up to them to switch to the profile page
      // res.send({ status: "success", msg: "data found." });


    }
});


app.get("/logout", function (req, res) {

  if (req.session) {
    req.session.destroy(function (error) {
      if (error) {
        res.status(400).send("Unable to log out")
      } else {
        // session deleted, redirect to home
        res.redirect("/");
      }
    });
  }
});

function authenticate(email, pwd, callback) {

  const mysql = require("mysql2");
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "destiny"
  });
  connection.connect();
  connection.query(
    //'SELECT * FROM user',
    "SELECT * FROM user WHERE email = ? AND password = ?", [email, pwd],
    function (error, results, fields) {
      // results is an array of records, in JSON format
      // fields contains extra meta data about results
      console.log("Results from DB", results, "and the # of records returned", results.length);

      if (error) {
        // in production, you'd really want to send an email to admin but for now, just console
        console.log(error);
      }
      if (results.length > 0) {
        // email and password found
        let a = results[0];
        return callback(results[0]);
      } else {
        // user not found
        return callback(null);
      }

    }

  );
}




/*
 * Function that connects to the DBMS and checks if the DB exists, if not
 * creates it, then populates it with a couple of records. This would be
 * removed before deploying the app but is great for
 * development/testing purposes.
 */
async function init() {

  // we'll go over promises in COMP 2537, for now know that it allows us
  // to execute some code in a synchronous manner
  const mysql = require("mysql2/promise");
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    multipleStatements: true
  });
  const createDBAndTables = `CREATE DATABASE IF NOT EXISTS destiny;
        use destiny;

        CREATE TABLE IF NOT EXISTS user (
        ID int NOT NULL AUTO_INCREMENT,
        name varchar(30),
        email varchar(30),
        password varchar(30),
        color varchar(30),
        city varchar(30),
        food varchar(30),
        PRIMARY KEY (ID));
        
        CREATE TABLE IF NOT EXISTS stats (
        ID int NOT NULL AUTO_INCREMENT,
        weapon varchar(30),
        userClass varchar(30),
        supers varchar(30),
        achievement varchar(30),
        type varchar(30),
        pet varchar(30),
        PRIMARY KEY (ID));
         `;

  await connection.query(createDBAndTables);



  // await allows for us to wait for this line to execute ... synchronously
  // also ... destructuring. There's that term again!
  const [rows, fields] = await connection.query("SELECT * FROM user");
  // no records? Let's add a couple - for testing purposes
  if (rows.length == 0) {
    // no records, so let's add a couple
    let userRecords = "insert into user (name, email, password, color, city, food) values ?";
    let recordValues = [
      ["Cayde-6", "cayde-6@my.bcit.ca", "abc123", "Black", "LastCity", "Ramen"],
      ["Zavala", "zavala@bcit.ca", "abc123", "blue", "DreamingCity", "pizza"],
      ["saint-14", "saint-14@bcit.ca", "abc123", "silver", "Cozmodrome", "Pasta"],
      ["LordShaxx", "shaxx@my.bcit.ca", "abc123", "red", "LastCity", "Lazania"],
      ["LordSaladin", "saladin@bcit.ca", "abc123", "gold", "FelwintersPeak", "Chicken"],
      ["FelWinter", "felwinter@bcit.ca", "abc123", "grey", "felwintersPeak", "cheesCake"],
      ["Osiris", "osiris@bcit.ca", "abc123", "white", "mercury", "chickenBurger"],
      ["Eris", "eirs@bcit.ca", "abc123", "green", "moon", "avocado"],
      ["MaraSov", "mara@bcit.ca", "abc123", "purple", "dreamingcity", "candy"],
      ["Crow", "crow@bcit.ca", "abc123", "white", "dreamingcity", "icecream"]
    ];
    await connection.query(userRecords, [recordValues]);
  }

  // await allows for us to wait for this line to execute ... synchronously
  // also ... destructuring. There's that term again!
  const [rows2, fields2] = await connection.query("SELECT * FROM stats");
  // no records? Let's add a couple - for testing purposes
  if (rows2.length == 0) {
    // no records, so let's add a couple
    let statsRecords = "insert into stats (weapon, userClass, supers, achievement, type, pet) values ?";
    let recordValues2 = [
      ["AceOfSpades", "Hunter", "Gunslinger", "Dreadnought", "ExoHuman", "Colonel"],
      ["ShadowPrice", "Titan", "Striker", "President", "Awoken", "Nopet"],
      ["perfectparadox", "Titan", "Ward of Dawn", "killingVex", "ExoHuman", "pigeon"],
      ["palindrome", "Titan", "HammerOfSoul", "PvPGod", "Human", "Ahamkara"],
      ["CleverDragon", "Titan", "HammerOfSoul", "IronLord", "Human", "Wolfe"],
      ["FelwintersLie", "Warlock", "WellOfRadience", "IronLord", "Exo", "Wolf"],
      ["VigilanceWing", "Warlock", "DawnBlade", "FormerVanguard", "Human", "Sagira"],
      ["TouchOfMalice", "Hunter", "SpectralBlade", "ThirdEye", "Human", "Hive"],
      ["AgerSepter", "TheQueen", "NoSubClass", "TheQueen", "Ewoken", "Ahamkara"],
      ["LunasHowl", "Hunter", "Arcstrider", "PrinceUldern", "Ewoken", "Glint"]
    ];
    await connection.query(statsRecords, [recordValues2]);
  }
  console.log("Listening on port " + port + "!");
}

// RUN SERVER
let port = 8000;
app.listen(port, init);
