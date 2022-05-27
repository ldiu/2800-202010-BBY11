document.getElementById("logoImg").addEventListener("click", changeBackground);


/**
   * Changes the background of the page as well as plays a sound
   * I found this code on w3schools.com
   *
   * @author w3schools.com
   * @see https://www.w3schools.com/js/js_timing.asp
   */
function changeBackground() {
    document.body.style.backgroundImage = "url('img/MILCyway.jpg')";
    let spaceSound = new Audio("sounds/spaceSound.mp3");
    spaceSound.play();
    setTimeout(revertChange, 3000);
}

function revertChange() {
    document.body.style.removeProperty("background-image");
}