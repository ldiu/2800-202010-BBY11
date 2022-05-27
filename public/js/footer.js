"use strict";

// This block of code to load a text file (footer) into the document is from a COMP 1800 Project
function loadFooter(){
    $('#footer').load('text/footer.html');
}

loadFooter();

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