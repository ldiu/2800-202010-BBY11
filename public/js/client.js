
async function submitNewPost(data) { //call is going to await this function has a call that will return promises and there will be an await on that promise. The code has to complete before line 46 happens. 
     console.log(data);
     try {
      let responseObject = await fetch("/createNewPost", { //replaces xml http request (the fecth part does)
          method: 'POST',
          headers: { "Accept": 'application/json',
                     "Content-Type": 'application/json'
          },
          body: JSON.stringify(data),
         
      });
      console.log("Response object", responseObject);
      let parsedJSON = await responseObject.json();
      console.log("From the server", parsedJSON);
     
  } catch(error) {
      console.log(error);
  }
}

document.getElementById("submitPost").addEventListener("click", function(e) {

  submitNewPost({
    text: document.getElementById("textForPost").value,
    date: Date(),
    images: [{
        name: document.getElementById("findImg").files[0].name,
        path: document.getElementById("findImg").files[0].name
    }]
  })
  console.log("Data was sent");
});

const upLoadForm = document.getElementById("postForm");
upLoadForm.addEventListener("submit", uploadImages);

function uploadImages(e) {
    // e.preventDefault();

    const imageUpload = document.querySelector('#findImg');
    const formData = new FormData();

    for(let i =0; i < imageUpload.files.length; i++) {
        // put the images from the input into the form data
        formData.append("files", imageUpload.files[i]);
    }

    const options = { //don't put in headers. 
        method: 'POST',
        body: formData, //these are the files - formData
        // don't put a header in, the browser will do that for us
//                headers: {
//                  "Content-Type": "multipart/form-data"
//                }
    };
    //delete options.headers['Content-Type'];

    // now use fetch
    fetch("/upload-images", options
    ).then(function(res) {
        console.log(res);
    }).catch(function(err) {("Error:", err)}
    );
}

 // console.log("From the server", parsedJSON);
      // let newValues = JSON.stringify(parsedJSON);
      // document.getElementById("insert").innerHTML = newValues;