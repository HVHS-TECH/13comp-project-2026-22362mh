var correctAnswer;

function getNumber(){
    correctAnswer = Math.floor(Math.random() * 6) + 1;
    console.log(correctAnswer);
}

function getGuess(){
    var guess = document.getElementById("guess");
    guess = guess.value;
    console.log(guess);

    if (guess == correctAnswer){
        console.log("You got it right!");
    }
    else {
        console.log("You are wrong.");
        var wrong = document.getElementById(guess);
        wrong.style.color = 'red';
    }
}

getNumber();