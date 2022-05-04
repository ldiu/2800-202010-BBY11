const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const port = 3000;

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signUp.html");
});

app.post("/", function(req, res){
var fName = body.req.floatingName;
var lName = body.req.floatingLastName;
var email = body.req.floatingEmail;
});



app.listen(port, function(){
  console.log("server is running on port " + port);
});