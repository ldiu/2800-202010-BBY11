"use strict";
let number1 = {
    value:1,
    isPressed:0,
    button: document.getElementById("button1")
};

let number2  = {
    value:1,
    isPressed:0,
    button: document.getElementById("button2")
};

let number3 = {
    value:1,
    isPressed:0,
    button: document.getElementById("button3")
};

let number4 = {
    value:1,
    isPressed:0,
    button: document.getElementById("button4")
};

let number5  = {
    value:1,
    isPressed:0,
    button: document.getElementById("button5")
};

let number6 = {
    value:24,
    isPressed:0,
    button: document.getElementById("button6")
};

let plus = {
    value:'+',
    button: document.getElementById("plus")
};

let minus = {
    value:'-',
    button: document.getElementById("minus")
};

let divide = {
    value:'/',
    button: document.getElementById("divide")
};

let multiply = {
    value:'x',
    button: document.getElementById("multiply")
}; 

let oBracket = {
    value:'(',
    button: document.getElementById("openBracket")
};

let cBracket = {
    value:')',
    button: document.getElementById("closeBracket")
};

//creates an array of randomly generated numbers and populates it
function insertRNG(){
    var RNG = [number1, number2, number3, number4, number5, number6];
    RNG[0].value = Math.floor((Math.random() * 9) + 1); //generate number from 1 to 9 inclusive
    var temp = [];
    for (let i = 0; i < 2; i++) {
        let number = Math.floor((Math.random() * 10) + 10) //generate number from 10 to 20 
        while (temp.includes(number)) {
            number = Math.floor((Math.random() * 10) + 10)
        }
        temp.push(number);
    }
    for (let i = 2; i < 4; i++) {
        let number = Math.floor((Math.random() * 15) + 20) //generate number from 20 to 35
        while (temp.includes(number)) {
            number = Math.floor((Math.random() * 15) + 20)
        }
        temp.push(number);
    }
    temp.push(Math.floor((Math.random() * 11) + 35)); //generate number from 35 to 45
    for (let i = 0; i < 5; i++) {
        RNG[i+1].value = temp[i];
    }
    // RNG[5].value = Math.floor((Math.random() * 41) + 51); //generate number from 60 to 100
    for(let i = 0; i < 6; i++){
        document.getElementById("button" + (i+1)).value = RNG[i].value;
    }
}
insertRNG();

// Button DOM elements
number1.button.onclick = function() {numbPressed(number1)};
number2.button.onclick = function() {numbPressed(number2)};
number3.button.onclick = function() {numbPressed(number3)};
number4.button.onclick = function() {numbPressed(number4)};
number5.button.onclick = function() {numbPressed(number5)};
number6.button.onclick = function() {numbPressed(number6)};

plus.button.onclick = function() {operationPressed(plus)};
minus.button.onclick = function() {operationPressed(minus)};
divide.button.onclick = function() {operationPressed(divide)};
multiply.button.onclick = function() {operationPressed(multiply)};
oBracket.button.onclick = function() {oBracketPressed(oBracket)};
cBracket.button.onclick = function() {cBracketPressed(cBracket)};

var solutionLine = document.getElementById("solutionLine");
solutionLine.innerText = "Your Solution";

//Container DOM elements
let solutionBox = document.getElementById("solutionBox");


//Logic Variables
var NUMB_NEXT = 1;
var OBRACKET_NEXT = 1;
var CBRACKET_NEXT = 0;
var numbersLeft = 6;
var bracketCount = 0;
var gameOver = 0;

var doOnce = (function() {
    var executed = false;
    return function() {
        if (!executed) {
            executed = true;
            if (numbersLeft == 6){
                solutionLine.innerText = "";
            }
        }
    };
})();

function numbPressed(number){
    doOnce(); //if a number is pressed first, the solution line is emptied, but only once
    if (NUMB_NEXT && !number.isPressed) {
        NUMB_NEXT = 0; //a number can't go after another number
        OBRACKET_NEXT = 0; //an open bracket can't go after a number
        number.isPressed = 1;
        numbersLeft--;

        numbShade(number);
        solutionLine.innerText += number.value;

        if(bracketCount){
            CBRACKET_NEXT = 1; //iff there's an unclosed open bracket, a closing bracket can go after a number
        }
    } else {
        shake(number.button);
    }
}
function operationPressed(operation){
    if(NUMB_NEXT || !numbersLeft){ //if a number is going next or there arent any numbers left, then an operation can never go next
        shake(operation.button);
    }  else {
        solutionLine.innerText += operation.value;
        NUMB_NEXT = 1;
        OBRACKET_NEXT = 1; //open bracket can go after an operation
        CBRACKET_NEXT = 0; //closing bracket can never go after an operation
    }
}

function oBracketPressed(operation){
    doOnce(); //if an operation is pressed first, the solution line is emptied, but only once
    if (OBRACKET_NEXT){
        solutionLine.innerText += operation.value;
        bracketCount++;
    } else {
        shake(operation.button);
    }
    
}

function cBracketPressed(operation){
    if (CBRACKET_NEXT && bracketCount){
        solutionLine.innerText += operation.value;
        bracketCount--;
        NUMB_NEXT = 0;
        OBRACKET_NEXT = 0;
    } else [
        shake(operation.button)
    ]
}

function numbShade(number) {
    number.isPressed = 1;
    number.button.style.color = "grey";
    
}

function numbUnShade(number) {
    number.isPressed = 0;
    number.button.style.color = "#CDBE78";
}

function submitAnswer() {
    if (numbersLeft == 0 && bracketCount == 0){
        let answer = solutionLine.innerText.replaceAll('x', '*');
        const func = new Function("return " + answer);
        if (func() === 24){
            applyShake(solutionBox);
            solutionBox.style.backgroundColor = "green";
            gameOver = 1;
        } else {
            applyShake(solutionBox);
            solutionBox.style.backgroundColor = "red";
            gameOver = 1;
        }
    } else {
        shake(solutionBox);
    }
    
}

function shake(container){
    let originalColor = container.style.color;
    container.style.borderColor = "red";
    container.style.color = "red";
    applyShake(container);
    setTimeout( () => {
        container.style.borderColor = "#CDBE78";
        container.style.color = originalColor;
    }, 170);
}

function applyShake(container){
    container.classList.add("apply-shake");
    container.addEventListener("animationend", (e) =>{
        container.classList.remove("apply-shake");
    });
}

function clearBoard(){
    if (gameOver){
        shake(document.getElementById("clearButton"));
    } else {
        resetBoard();
    }
}

function playAgain(){
    if(gameOver){
        let numbers = [number1, number2, number3, number4, number5, number6];
        resetBoard();
        insertRNG();
        gameOver = 0;
        solutionBox.style.backgroundColor = "#2C3333";
        applyShake(solutionBox);
        for(let i = 0; i < 6; i++) {
            applyShake(numbers[i].button);
        }
        solutionLine.innerText = "Play Again!";
        setTimeout( () =>{
            solutionLine.innerText = "";
        }, 500);
    }
}

function resetBoard(){
    NUMB_NEXT = 1;
    OBRACKET_NEXT = 1;
    CBRACKET_NEXT = 0;
    numbersLeft = 6;
    bracketCount = 0;
    
    let numbers = [number1, number2, number3, number4, number5, number6];
    for(let i = 0; i < 6; i++) {
        if(numbers[i].isPressed){
            numbUnShade(numbers[i]);
        }
    }
    solutionLine.innerText = "";
}

$(".hoverInstructions").click(function () {
    $.ajax({
        success: function (data) {            
            $('#info-modal').addClass("show"); 
        },
        async: true
    });    
});

$(".modal-dialog .close").click(function(){
    $(this).closest(".modal-dialog").removeClass("show");
});
