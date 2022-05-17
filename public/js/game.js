"use strict";
let number1 = {
    value:-1,
    isPressed:0,
    button: document.getElementById("button1")
};

let number2  = {
    value:-1,
    isPressed:0,
    button: document.getElementById("button2")
};

let number3 = {
    value:-1,
    isPressed:0,
    button: document.getElementById("button3")
};

let number4 = {
    value:-1,
    isPressed:0,
    button: document.getElementById("button4")
};

let number5  = {
    value:-1,
    isPressed:0,
    button: document.getElementById("button5")
};

let number6 = {
    value:-1,
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

// let oBracket = {
//     value: '(',
//     button: document.getElementById("openBracket")
// };

// let cBracket = {
//     value: ')',
//     button: document.getElementById("closeBracket")
// };

//creates an array of randomly generated numbers and populates it
function insertRNG(){
    var RNG = [number1, number2, number3, number4, number5, number6];
    RNG[0].value = Math.floor((Math.random() * 9) + 1);
    var temp = [];
    for (let i = 0; i < 4; i++) {
        let number = Math.floor((Math.random() * 41) + 10)
        while (temp.includes(number)) {
            number = Math.floor((Math.random() * 41) + 10)
        }
        temp.push(number);
    }
    for (let i = 0; i < 4; i++) {
        RNG[i+1].value = temp[i];
    }
    RNG[5].value = Math.floor((Math.random() * 41) + 60);
    console.log(RNG);
    for(let i = 0; i < 6; i++){
        document.getElementById("button" + (i+1)).value = RNG[i].value;
        console.log(RNG[i])
    }
}
insertRNG();

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

var NUMB_NEXT = 1;
var numbersLeft = 6;

document.getElementById("solutionLine").innerHTML = "Your Solution";

function numbPressed(number){
    //can make more brief, just temporary///
    if (numbersLeft == 6){
        document.getElementById("solutionLine").innerHTML = "";
    }
    if(number.isPressed) {
        console.log("numbPressed called, this number has already been pressed");
    } else if (NUMB_NEXT && !number.isPressed) {
        NUMB_NEXT = 0;
        console.log("numbPressed called, number added to solutionLine");
        document.getElementById("solutionLine").innerHTML += number.value;
        number.isPressed = 1;
        numbShade(number);
        numbersLeft--;
    }
    else {
        console.log("numbPressed called, operation must be used next");
    }
}
function operationPressed(operation){
    if(NUMB_NEXT){
        console.log("operationPressed called, number must be used next");
    } else if (numbersLeft == 0) {
        console.log("operationPressed called, No more numbers");
    }
    else {
        console.log("operationPressed called, operation added to solutionLine");
        document.getElementById("solutionLine").innerHTML += operation.value;
        NUMB_NEXT = 1;
    }
}

function numbShade(number) {
    if(number.isPressed){
        console.log("numbShade called, shading number");
        number.button.style.color = "grey"; //not final!!! just a placeholder
    } else {
        console.log("numbShade called, unshading number");
        number.button.style.color = "white";
    }
}

function submitAnswer() {
    if (numbersLeft == 0){
        var answer = document.getElementById("solutionLine").innerText;
        console.log(answer);
    } else {
        console.log("submitAnswer called, can't submit answer until all numbers are used");
    }
    
}