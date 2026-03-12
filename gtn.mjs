var correctAnswer;

function getNumber(){
    correctAnswer = Math.floor(Math.random() * 20) + 1;
    console.log(correctAnswer);
}

function getGuess(){
    var guess = document.getElementById("guess");
    guess = guess.value;
    console.log(guess);

    if (guess == correctAnswer){
        console.log("You got it right!");
        alert("You got it right!");
    }
    else if(guess <= 0){
        alert("Put in a number between 1 and 20!");
    }
    else if(guess > 20){
        alert("Put in a number between 1 and 20!")
    }
    else if (guess < correctAnswer){
        console.log("Higher!");
        alert("The number is higher!");
        var wrong = document.getElementById(guess);
        wrong.style.color = 'rgb(170, 0, 0)';
    }
    else if (guess > correctAnswer){
        console.log("Lower!");
        alert("The number is lower!");
        wrong = document.getElementById(guess);
        wrong.style.color = 'rgb(170, 0, 0)';
    }
}

getNumber();