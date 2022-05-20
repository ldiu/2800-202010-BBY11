document.getElementById("logo").addEventListener("click", changeBackground);

function changeBackground() {
    document.body.style.backgroundImage = "url('img/MILCyway.jpg')";
    let spaceSound = new Audio("sounds/spaceSound.mp3");
    spaceSound.play();
    setTimeout(revertChange, 1700);
}

function revertChange() {
    document.body.style.removeProperty("background-image");
}