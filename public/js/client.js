"use strict";


//--- User presses edit, colours change and buttons appear ---//



/* Update Function
 * This update() function was heavily adapted from Instructor Carly Orr's
 * "demo 10" script from COMP 1800 coursework. It allows the user to open their 
 * information fields and Edit. It also changes the colour to indicate that
 * it is editable.
 */
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


/* Submit new Post
 * This submitNewPost block of code was adapted from Instructor Arron Ferguson's
 * "index.html-fetch example" script from 2537 coursework. It is for creating an async 
 * function to submit a new post.
 */
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



/* Submit new post - Call function on click
 * This submitNewPost block of code is heavily adapted from Instructor Arron Ferguson's
 * "index.html-fetch example" script from 2537 coursework. It is calling a function
 * that retrieves the input data from the user and sends to the server.
 */
document.getElementById("submitPost").addEventListener("click", function (e) {

  if(document.getElementById("findImg").value == ""){
    
    submitNewPost({
        text: document.getElementById("textForPost").value,
        date: Date(),
        images: [{
            name: "",
            path: ""
        }]
    })
    console.log("Data was sent");

  } else if (document.getElementById("textForPost").value == ""){

    submitNewPost({
        text: "",
        date: Date(),
        images: [{
            name: document.getElementById("findImg").files[0].name,
            path: document.getElementById("findImg").files[0].name
        }]
    })
    console.log("Data was sent");

  } else {
    submitNewPost({
        text: document.getElementById("textForPost").value,
        date: Date(),
        images: [{
            name: document.getElementById("findImg").files[0].name,
            path: document.getElementById("findImg").files[0].name
        }]
    })
    console.log("Data was sent");
  }
});


/* Get My Images
 * This getMyImages block of code was adapted from Instructor Arron Ferguson's
 * "index.html - upload-file" script example from 2537 coursework. It is for 
 * fetching and saving images to img folder. 
 */ 
const newFormUpload = document.getElementById("postForm");
newFormUpload.addEventListener("submit", getMyImages);

function getMyImages(e) {

    const uploadMyImages = document.querySelector('#findImg');
    const dataFromForm = new FormData();

    for (let index = 0; index < uploadMyImages.files.length; index++) {
        
        dataFromForm.append("files", uploadMyImages.files[index]);
    }
    const setMethodBody = { 
        method: 'POST',
        body: dataFromForm, 
     
    };

    fetch("/saveImage", setMethodBody
    ).then(function (res) {
        console.log(res);
    }).catch(function (error) { ("Error message is:", error) }
    );
}

/**
   * Displays image name on the screen when uplaoding an image. 
   * I found this code on Stack Overflow.
   *
   * @author Mohammad Web developer at Ravaghsoft
   * @see https://stackoverflow.com/questions/41542845/how-to-display-file-name-for-custom-styled-input-file-using-jquery
   */
document.querySelector("#findImage").onchange = function(){
    document.querySelector("#findImageName").textContent = this.files[0].name;
  }


/**
   * Displays image name on the screen when uplaoding an image. 
   * I found this code on Stack Overflow.
   *
   * @author Mohammad Web developer at Ravaghsoft
   * @see https://stackoverflow.com/questions/41542845/how-to-display-file-name-for-custom-styled-input-file-using-jquery
   */
document.querySelector("#findImg").onchange = function(){
    document.querySelector("#findImgName").textContent = this.files[0].name;
  }