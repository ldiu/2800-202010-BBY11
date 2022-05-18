async function submitNewPost(data) { //call is going to await this function has a call that will return promises and there will be an await on that promise. The code has to complete before line 46 happens. 
  try {
      let responseObject = await fetch("/createNewPost", { //replaces xml http request (the fecth part does)
          method: 'POST',
          headers: { "Accept": 'application/json',
                     "Content-Type": 'application/json'
          },
          body: JSON.stringify(data)
      });
      console.log("Response object", responseObject);
      let parsedJSON = await responseObject.json();
      window.location.replace("/userProfilePage.html");
      // console.log("From the server", parsedJSON);
      // let newValues = JSON.stringify(parsedJSON);
      // document.getElementById("insert").innerHTML = newValues;
  } catch(error) {
      console.log(error);
  }
}

document.getElementById("submitPost").addEventListener("click", function(e){
  let textOfPost = document.getElementById("textForPost").value; 
  let imageForPost = document.getElementById("findImg").value; //this value is a string that represents the path to the selected file(s)

  submitNewPost({
    text: document.getElementById("textForPost").value,
    date: Date(),
    images: [{
        name:"image1",
        path:document.getElementById("findImg").value
    }]
  })
});