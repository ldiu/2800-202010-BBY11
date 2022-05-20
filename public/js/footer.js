"use strict";

// function loadFooter(){
//     $('#footer').load('public/text/footer.html');
// }

// loadFooter();

function displayDropdown(){
    let menuDisplay = document.getElementById("menu").style.display;
    let menuItemDisplay = document.getElementById("menuItem").style.display;

    if (menuDisplay === "none"){
        menuDisplay = "block";
        menuItemDisplay = "block";
    } else {
        menuDisplay = "none";
        menuItemDisplay = "none";
    }

}