'use strict';
const btnChangeNumbers=document.getElementById('changeNumbers');
const btnStart=document.getElementById('startButton');
const CurrentBingoNumber=document.getElementById('CurrentNumber');
const btnSubmit = document.getElementById('SubmitNumbers');

const prizes=[10000, 7500, 5000, 2500, 1000, 500, 300, 200, 150, 100, 90, 80, 70, 60, 50, 40, 30, 25, 20, 15, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

let drawnNumbers=[];
let ArrayOfPickedNumbers=[];
let counterOfMatchingNumbers=0;
let temp=0;
let temp2=false;
let counter=1;
let prize=0;

//When called delays the loop
const sleep = (time)=>{
    return new Promise(resolve=>setTimeout(resolve, time));
}

//Main loop for displaying bingo balls into their matching fields
const doSomething = async () => {
    while(counter<=35){
        await sleep(1000);
        let randomNumber=Math.trunc(Math.random()*48)+1;
        
        for(let i=0;i<drawnNumbers.length;i++){
            if(drawnNumbers[i]===randomNumber){
                temp++;
            }
        }
        
        if(temp>0){
            counter--;
        }
        else{
            drawnNumbers.push(randomNumber);
            currentNumber(randomNumber);
            document.getElementById(`field${counter}`).innerHTML=
            `
            <img src="bingoBalls/${randomNumber}.png" class="ballPicture">
            `;
            console.log(ArrayOfPickedNumbers);

            for(let i=0;i<6;i++){
                if(ArrayOfPickedNumbers[i]===randomNumber){
                    document.getElementById(`PlayersNumber${i+1}`).classList.add('WinningNumber');
                    counterOfMatchingNumbers++;
                }
            }
            
        }
        if(counterOfMatchingNumbers===6){
            let x=counter;
            counter=36;
            winGame(x);
        }
        counter++;
        temp=0;
    }
    if(counter===36 && counterOfMatchingNumbers!==6){
        loseGame();
    }
}

//IMPLEMENTATION OF BUTTONS

//Checks if all the input parameters are valid, and if so, allows player to start the game
btnSubmit.addEventListener('click', function(){
    const validateMoney=Number(document.getElementById('money').value);

    for(let i=1;i<7;i++){
        ArrayOfPickedNumbers.push(Number(document.getElementById(`number${i}`).value));
    }

    for(let i=0;i<ArrayOfPickedNumbers.length;i++){
        if(ArrayOfPickedNumbers[i]>48 || ArrayOfPickedNumbers[i] < 1){
            InvalidInput('Your input is invalid');
            console.log(ArrayOfPickedNumbers);
            temp2=true;
            break;
        }
    }
    
    if(temp2==false){
        if(CheckForTheSameNumbers(ArrayOfPickedNumbers)===true){
            InvalidInput('Numbers cant be repeated');
        }
        else if(validateMoney<1 || validateMoney===""){
            InvalidInput('Invalid money amount');
        }
        else{
            PlayersNumbers(ArrayOfPickedNumbers);
            document.getElementById('InputNumbers').classList.add('hidden');
            showButtons();
        }
    }
    
    temp2=false;
    });
    
    const btnReset=document.getElementById('RESET');
    btnReset.addEventListener('click', function(){
        reset();
})

//Starts the game
btnStart.addEventListener('click', function(){
    doSomething();
    hideButtons();
    circleColors();
})

//Allows player to return to submit window if he changes his mind
btnChangeNumbers.addEventListener('click', function(){
    document.getElementById('InputNumbers').classList.remove('hidden');
    
    for(let i=1;i<7;i++){
        document.getElementById(`PlayersNumber${i}`).innerHTML="";
    }
    
    hideButtons();
    ArrayOfPickedNumbers=[];
})


//FUNCTIONS

//Inputs current numbers picture into large middle field
function currentNumber(PickedNumber){
    CurrentBingoNumber.innerHTML=
    `
    <img src="bingoBalls/${PickedNumber}.png" class="ballPicture">
    
    `
}

//Clears input fields if they are invalid
function InvalidInput(message){
    ArrayOfPickedNumbers=[];
    alert(message);
    clearInput();
}

//Checks for same numbers inside of input fields
function CheckForTheSameNumbers(arr){
    for(let i=0;i<arr.length;i++){
        
        for(let j=i+1;j<arr.length;j++){
            
            if(arr[i]===arr[j]){
                ArrayOfPickedNumbers=[];
                return true;
            }
        }
    }

    return false;
}

//Inputs pictures into "Your numbers" fields
function PlayersNumbers(arr){
    for(let i=0;i<6;i++){
        document.getElementById(`PlayersNumber${i+1}`).innerHTML=
        `
        <img src="bingoBalls/${arr[i]}.png" class="ballPicture">
        `
    }
}

//Displays all buttons
function showButtons(){
    document.getElementById('RESET').classList.remove('hidden');
    document.getElementById('changeNumbers').classList.remove('hidden');
    document.getElementById('startButton').classList.remove('hidden');  
}

//Hides all buttons
function hideButtons(){
    document.getElementById('RESET').classList.add('hidden');
    document.getElementById('changeNumbers').classList.add('hidden');
    document.getElementById('startButton').classList.add('hidden');
}

//Clears input fields
function clearInput(){
    document.getElementById('number1').value="";
    document.getElementById('number2').value="";
    document.getElementById('number3').value="";
    document.getElementById('number4').value="";
    document.getElementById('number5').value="";
    document.getElementById('number6').value="";
    document.getElementById('money').value="";
    ArrayOfPickedNumbers=[];
}

//Resets the game completely
function reset(){
    clearInput();

    for(let i=1;i<7;i++){
        document.getElementById(`PlayersNumber${i}`).innerHTML="";
    }

    document.getElementById('InputNumbers').classList.remove('hidden');

    for(let i=1;i<36;i++){
        document.getElementById(`field${i}`).innerHTML="";
    }

    hideButtons();
    counterOfMatchingNumbers=0;

    for(let i=1;i<7;i++){
        document.getElementById(`PlayersNumber${i}`).classList.remove('WinningNumber');
    }

    counter=1;
    ArrayOfPickedNumbers=[];
    drawnNumbers=[];
    counterOfMatchingNumbers=0;
    temp=0;
    temp2=false;
    stopColors();
}

//Calls when button "Play again" is pressed after winning or losing, resets the game
function playAgain(){
    reset();
    document.getElementById('CurrentNumber').innerHTML="";
    document.getElementById('endingWindow').classList.add('hidden');
}

//Displays winner window with prize
function winGame(index){
    document.getElementById('endingWindow').classList.remove('hidden');
    document.getElementById('endingWindow').innerHTML=
    `
    <h3>Congratulations!</h3>
        <h3>You won!</h3>
        <h3>Your prize is</h3>
        <p id="prize" class="prizeText">${decidePrize(index-6)} KM</p>
        <button id="playAgain" onclick="playAgain()">Play again</button>
    `
}

//Displays loser window
function loseGame(){
    document.getElementById('endingWindow').classList.remove('hidden');
    document.getElementById('endingWindow').innerHTML=
    `
    <h3>Sorry :( </h3>
        <h3>You lost</h3>
        <h3 style="margin-bottom: 5%">Better Luck Next Time</h3>
        <button id="playAgain" onclick="playAgain()" style="margin-bottom: 2%">Play again</button>
    `
    stopColors();
}

//Multiplies the amount of money you bet with the amount you won from the last field
function decidePrize(index){
    const moneyFromInput=Number(document.getElementById('money').value);
    let prize=prizes[index]*moneyFromInput;
    return prize;
}

//Changes colors in BINGO h1s when playing
function circleColors(){
    document.getElementById('bingo1').classList.add('startPlaying');
    document.getElementById('bingo2').classList.add('startPlaying');
}

//Stops changing colors in BINGO h1s
function stopColors(){
    document.getElementById('bingo1').classList.remove('startPlaying');
    document.getElementById('bingo2').classList.remove('startPlaying');
}