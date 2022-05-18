
"use strict";

const { response } = require("express");

//The following code follows a demo represented by the instructor's in 1800 course Projects. 
function update() {
  
  document.getElementById("userFields").disabled = false;
}

async function loadTimeline() {
  try {
    let posts = await fetch("/getPosts", {
      method: 'GET'
    });
    if (response.status === 200) {
      let data = await posts.text();
      let frag = document.createRange().createContextualFragment(data);
      document.getElementById("container").appendChild(frag);
    } else {
      console.log(response.status);
      console.log(response.statusText);
    }
  } catch (error) {
    console.log(error);
  }
}

loadTimeline();


