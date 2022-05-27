"use strict";

//--- parse through the users info ---//

async function loadUserProfile() {
  try {
    let userProfile = await fetch("/getUserInfo", {
      method: 'GET'
    });

    //parse through the users info, display in inputs. 
    let userInfo = await userProfile.json();

    // //Create welcome div
    let welcomeUser = document.getElementById("welcome");
    welcomeUser.innerHTML = "Welcome to your profile " + userInfo.name;

    //create avatar to populate
    let imageUpload = document.getElementById("profileImage");
    imageUpload.src = userInfo.imagePath;

    //populate fields
    let userFirstName = document.getElementById("userFirstName");
    userFirstName.setAttribute("value", userInfo.name);

    let userLastName = document.getElementById("userLastName");
    userLastName.setAttribute("value", userInfo.lastName);

    let userEmail = document.getElementById("userEmail");
    userEmail.setAttribute("value", userInfo.email);

    let userPassword = document.getElementById("userPassword");
    userPassword.setAttribute("value", userInfo.password);

  } catch (error) {
    console.log(error);
    document.getElementById("container2").innerHTML = "There are no users to display.";
  }
}

loadUserProfile();



async function updateUserInfo(data) {
  console.log(data);
  try {
    let responseObject = await fetch("/editUserInfo", {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(data),

    });
    console.log("Response object", responseObject);
    let parsedJSON = await responseObject.json();
    console.log("From the server", parsedJSON);

  } catch (error) {
    console.log(error);
  }
}

/**
   * Returns true if the string is all spaces or empty. 
   * I found this code on bobbyhadz blog.
   *
   * @author Borislav Hadzhiev
   * @see https://bobbyhadz.com/blog/javascript-check-if-string-contains-only-spaces
   */
function stringEmpty(myString) {
  return myString.trim().length === 0;
}


/**
   * Validates an email address inputed by the user. 
   * I found this code on Grepper with the help of lab instructor Nabil.
   *
   * @author Annoying Armadillo on May 11 2020
   * @see https://www.codegrepper.com/code-examples/javascript/javascript+check+email+format
   */
function validateEmail(userInput) {
  const matchThis = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return matchThis.test(String(userInput).toLowerCase());
}


/**
 * The following code upon click event will change color of input boxes,
 * display new buttons, check the users input, and sends it to app.js
 */

document.getElementById("saveButton").addEventListener("click", function (e) {
  document.getElementById("editButton").style.display = "block";
  document.getElementById("userFirstName").style.backgroundColor = "rgb(81, 81, 81)";
  document.getElementById("userFirstName").style.color = "rgb(48, 48, 48)";
  document.getElementById("userLastName").style.backgroundColor = "rgb(81, 81, 81)";
  document.getElementById("userLastName").style.color = "rgb(48, 48, 48)";
  document.getElementById("userEmail").style.backgroundColor = "rgb(81, 81, 81)";
  document.getElementById("userEmail").style.color = "rgb(48, 48, 48)";
  document.getElementById("userPassword").style.backgroundColor = "rgb(81, 81, 81)";
  document.getElementById("userPassword").style.color = "rgb(48, 48, 48)";

  if(stringEmpty(document.getElementById("userFirstName").value) ||
  stringEmpty(document.getElementById("userLastName").value) ||
  stringEmpty(document.getElementById("userEmail").value)|| 
  stringEmpty(document.getElementById("userPassword").value) || 
  document.getElementById("userEmail").value.trim() == "@" || 
  document.getElementById("userEmail").value == "@" || 
  !document.getElementById("userEmail").value.includes("@") ||
  !validateEmail(document.getElementById("userEmail").value)){
    console.log("Must input letters");

  } else if (document.getElementById("findImage").value == ""){

    updateUserInfo({
      email: document.getElementById("userEmail").value,
      password: document.getElementById("userPassword").value,
      name: document.getElementById("userFirstName").value,
      lastName: document.getElementById("userLastName").value,
      imagePath: ""
      
    })
    console.log("Data was sent");

  } else {
    updateUserInfo({
      email: document.getElementById("userEmail").value,
      password: document.getElementById("userPassword").value,
      name: document.getElementById("userFirstName").value,
      lastName: document.getElementById("userLastName").value,
      imagePath: "img/" + document.getElementById("findImage").files[0].name
    })
    console.log("Data was sent");
  }
});


/* Get Images
 * This getImages block of code was adapted from Instructor Arron Ferguson's
 * "index.html - upload-file" script example from 2537 coursework. It is for 
 * fetching and saving images to img folder. 
 */ 
const newForm = document.getElementById("buttonForm");
newForm.addEventListener("submit", getImages);

function getImages(e) {

  const uploadMyImages = document.querySelector('#findImage');
  const dataFromForm = new FormData();

  for (let index = 0; index < uploadMyImages.files.length; index++) {

    dataFromForm.append("files", uploadMyImages.files[index]);
  }
  const setMethodBody = {
    method: 'POST',
    body: dataFromForm,

  };

  fetch("/saveProfileImage", setMethodBody
  ).then(function (res) {
    console.log(res);
  }).catch(function (error) { ("Error message is:", error) }
  );
}
