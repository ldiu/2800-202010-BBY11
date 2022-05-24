"use strict";

// Code follows similar outline to "fetch-example" from 2537 course.
async function submitNewPost(data) {
  console.log(data);
  try {
    let responseObject = await fetch("/createNewPost", {
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

//Code follows similar outline to "fetch-example" from 2537 course.
// document.getElementById("submitPost").addEventListener("click", function (e) {

//   if(document.getElementById("findImg").value == ""){

//     submitNewPost({
//         text: document.getElementById("textForPost").value,
//         date: Date(),
//         images: [{
//             name: "",
//             path: ""
//         }]
//     })
//     console.log("Data was sent");

//   } else if (document.getElementById("textForPost").value == ""){

//     submitNewPost({
//         text: "",
//         date: Date(),
//         images: [{
//             name: document.getElementById("findImg").files[0].name,
//             path: document.getElementById("findImg").files[0].name
//         }]
//     })
//     console.log("Data was sent");

//   } else {
//     submitNewPost({
//         text: document.getElementById("textForPost").value,
//         date: Date(),
//         images: [{
//             name: document.getElementById("findImg").files[0].name,
//             path: document.getElementById("findImg").files[0].name
//         }]
//     })
//     console.log("Data was sent");
//   }
// });

//Code follows Instructor Arron's "upload-file" example from 2537 course work. 
// const newFormUpload = document.getElementById("postForm");
// newFormUpload.addEventListener("submit", getMyImages);

// function getMyImages(e) {

//     const uploadMyImages = document.querySelector('#findImg');
//     const dataFromForm = new FormData();

//     for (let index = 0; index < uploadMyImages.files.length; index++) {

//         dataFromForm.append("files", uploadMyImages.files[index]);
//     }
//     const setMethodBody = { 
//         method: 'POST',
//         body: dataFromForm, 

//     };

//     fetch("/saveImage", setMethodBody
//     ).then(function (res) {
//         console.log(res);
//     }).catch(function (error) { ("Error message is:", error) }
//     );
// }

//parse through the users info
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

function update() {

  document.getElementById("userFields").disabled = false;
  document.getElementById("saveButton").style.display = "block";
  document.getElementById("chooseImage").style.display = "block";
  document.getElementById("editButton").style.display = "none";
  document.getElementById("userFirstName").style.backgroundColor = "#F2F2F2";
  document.getElementById("userFirstName").style.color = "black";
  document.getElementById("userLastName").style.backgroundColor = "#F2F2F2";
  document.getElementById("userLastName").style.color = "black";
  document.getElementById("userEmail").style.backgroundColor = "#F2F2F2";
  document.getElementById("userEmail").style.color = "black";
  document.getElementById("userPassword").style.backgroundColor = "#F2F2F2";
  document.getElementById("userPassword").style.color = "black";
}
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
  if (document.getElementById("findImage").value == ""){

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

//Code follows Instructor Arron's "upload-file" example from 2537 course work. 
const newFormUpload = document.getElementById("buttonForm");
newFormUpload.addEventListener("submit", getMyImages);

function getMyImages(e) {

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
