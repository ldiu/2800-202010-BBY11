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
      
      let userContainer = document.createElement('div')
      userContainer.setAttribute("id", "container3"); //container is open, encases all at the end. 
      
      //Create welcome div
      let welcomeUser = document.createElement('div');
      welcomeUser.setAttribute("id", "welcome");
      welcomeUser.innerHTML = "Welcome to your profile " + userInfo.name;
      
      //create image div
      let avatarContainerElement = document.createElement('div');
      avatarContainerElement.setAttribute("id", "imageContainer");
      let photoElement = document.createElement('img');
      photoElement.className = "profileImage";
      photoElement.src = userInfo.imagePath;
      avatarContainerElement.appendChild(photoElement);

      //Next, create inputs with displayed values. 
      let fieldsetElement = document.createElement('fieldset');
      fieldsetElement.setAttribute("id", "userFields");
      fieldsetElement.setAttribute('disabled', '');

      let infoFormElement = document.createElement('form');
      infoFormElement.setAttribute("id", "buttonForm");
      
      let imageLabel = document.createElement('label');
      imageLabel.setAttribute("for", "findImage");
      imageLabel.className = "findImageStyle";
      imageLabel.textContent = "Choose Image";
      let imageInput = document.createElement('input');
      imageInput.setAttribute("id", "findImage");
      imageInput.setAttribute("type", "file");
      imageInput.setAttribute("name", "imageToUpload");
      imageLabel.appendChild(imageInput);
      
      //first name input
      let firstNameInput = document.createElement('input');
      firstNameInput.setAttribute("id", "userFirstName");
      firstNameInput.setAttribute("type", "text");
      firstNameInput.setAttribute("value", userInfo.name);

      //last name input
      let lastNameInput = document.createElement('input');
      lastNameInput.setAttribute("id", "userLastName");
      lastNameInput.setAttribute("type", "text");
      lastNameInput.setAttribute("value", userInfo.lastName);

      //email input
      let emailInput = document.createElement('input');
      emailInput.setAttribute("id", "userEmail");
      emailInput.setAttribute("type", "email");
      emailInput.setAttribute("value", userInfo.email);

      //password input
      let passwordInput = document.createElement('input');
      passwordInput.setAttribute("id", "userPassword");
      passwordInput.setAttribute("type", "password");
      passwordInput.setAttribute("value", userInfo.password);

      //save button
      let saveButton = document.createElement('button');
      saveButton.setAttribute("id", "saveButton");
      saveButton.setAttribute("type", "submit");
      saveButton.addEventListener("click", updateUserInfo); //remember this will be a callbacl function. 
      saveButton.textContent = "Save";
      
      //Enclose input elements in form
      infoFormElement.appendChild(imageLabel);
      infoFormElement.appendChild(firstNameInput);
      infoFormElement.appendChild(lastNameInput);
      infoFormElement.appendChild(emailInput);
      infoFormElement.appendChild(passwordInput);
      infoFormElement.appendChild(saveButton);
      
      //Enclose form inside fieldset element
      fieldsetElement.appendChild(infoFormElement);

      //create edit form
      let editFormElement = document.createElement('form');
      editFormElement.setAttribute("id", "edit");

      let editUserInfoButton = document.createElement('button');
      editUserInfoButton.setAttribute("id", "editButton");
      editUserInfoButton.setAttribute("type", "button");
      editUserInfoButton.textContent = "Edit";
      editUserInfoButton.addEventListener("click", update);

      editFormElement.appendChild(editUserInfoButton);

      //Now we will close container3 div, first though, append the welcome, the image, and the inputs.
      userContainer.append(welcomeUser, avatarContainerElement, fieldsetElement, editFormElement);
      
      document.getElementById("container2").appendChild(userContainer);
  
    } catch (error) {
      console.log(error);
      document.getElementById("container2").innerHTML = "There are no users to display.";
    }
  }
  
  loadUserProfile();

  function update() {

    document.getElementById("userFields").disabled = false;
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


window.onload=function(){
  
  document.getElementById("saveButton").addEventListener("click", function (e) {

    if(document.getElementsByClassName("profileImage").value == ""){
      
      updateUserInfo({
          email: document.getElementById("userEmail").value,
          password: document.getElementById("userPassword").value,
          name: document.getElementById("userFirstName").value,
          lastName: document.getElementById("userLastName").value,
          imagePath: "img/johndoe.png"
      })
      console.log("Data was sent");
  
    } else {
      updateUserInfo({
        email: document.getElementById("userEmail").value,
        password: document.getElementById("userPassword").value,
        name: document.getElementById("userFirstName").value,
        lastName: document.getElementById("userLastName").value,
        imagePath: document.getElementById("findImage").files[0].name
    })
      console.log("Data was sent");
    }});

}

//Code follows Instructor Arron's "upload-file" example from 2537 course work. 

window.onload=function(){

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
}
