// const upLoadForm = document.getElementById("postForm");
// upLoadForm.addEventListener("submitPost", uploadImages);

// function uploadImages(e) {
//     e.preventDefault();

//     const imageUpload = document.querySelector('#findImg');
//     const formData = new FormData();

//     for(let i =0; i < imageUpload.files.length; i++) {
//         // put the images from the input into the form data
//         formData.append("files", imageUpload.files[i]);
//     }

//     const options = { //don't put in headers. 
//         method: 'POST',
//         body: formData, //these are the files - formData
//         // don't put a header in, the browser will do that for us
// //                headers: {
// //                  "Content-Type": "multipart/form-data"
// //                }
//     };
//     //delete options.headers['Content-Type'];

//     // now use fetch
//     fetch("/createNewPost", options
//     ).then(function(res) {
//         console.log(res);
//     }).catch(function(err) {("Error:", err)}
//     );
// }

// async function submitNewPost(data) { //call is going to await this function has a call that will return promises and there will be an await on that promise. The code has to complete before line 46 happens. 
//   try {
//       let responseObject = await fetch("/createNewPost", { //replaces xml http request (the fecth part does)
//           method: 'POST',
//           headers: { "Accept": 'application/json',
//                      "Content-Type": 'application/json'
//           },
//           body: JSON.stringify(data)
//       });
//       console.log("Response object", responseObject);
//       let parsedJSON = await responseObject.json();
//       console.log("Data was sent");
//       window.location.replace("/userProfilePage.html");
     
//   } catch(error) {
//       console.log(error);
//   }
// }

// document.getElementById("submitPost").addEventListener("click", function(e) {
//   let textOfPost = document.getElementById("textForPost").value; 
//   let imageForPost = document.getElementById("findImg").value; //this value is a string that represents the path to the selected file(s)

//   submitNewPost({
//     text: document.getElementById("textForPost").value,
//     date: Date(),
//     images: [{
//         name:"image1",
//         path: document.getElementById("findImg").value
//     }]
//   })
//   console.log("Data was sent");
// });

 // console.log("From the server", parsedJSON);
      // let newValues = JSON.stringify(parsedJSON);
      // document.getElementById("insert").innerHTML = newValues;