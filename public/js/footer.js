"use strict";


/* Load Footer Function
 * This loadFooter function was adapted from Instructor Carly Orr's
 * COMP 1800 Projects coursework. It loads the footer to the page.
 */
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