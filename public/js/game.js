//creates an array of randomly generated numbers and populates it
function insertRNG(){
    var RNG = [];
    let number = Math.floor((Math.random() * 9) + 1);
    RNG.push(number);
    for (let i = 0; i < 4; i++) {
        let number = Math.floor((Math.random() * 41) + 10)
        while (RNG.includes(number)) {
            number = Math.floor((Math.random() * 41) + 10)
        }
        RNG.push(number);
    }
    number = Math.floor((Math.random() * 41) + 60);
    RNG.push(number);
    console.log(RNG);
    for(let i = 0; i < 6; i++){
    document.getElementById("button" + (i+1)).value = RNG[i];
    console.log(RNG[i])
    }
}
insertRNG();