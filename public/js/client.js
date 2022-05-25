"use strict";

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

//Code follows Instructor Arron's "upload-file" example from 2537 course work. 
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