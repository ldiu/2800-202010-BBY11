document.getElementById("logoImg").addEventListener("click", changeBackground);

// This function changes the background of the page as wella s plays a sound and was creaeted with the help of:
//https://www.w3schools.com/js/js_timing.asp
function changeBackground() {
    document.body.style.backgroundImage = "url('img/MILCyway.jpg')";
    let spaceSound = new Audio("sounds/spaceSound.mp3");
    spaceSound.play();
    setTimeout(revertChange, 3000);
}

function revertChange() {
    document.body.style.removeProperty("background-image");
}