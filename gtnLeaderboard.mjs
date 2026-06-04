//FIREBASE SCORE INPUT
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import { ref, set, query, orderByChild, limitToFirst, get, child } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";

import { userUid } from "./fb_io.mjs";
import { username as userName } from "./login.mjs"

import { fb_gamedb, fb_initialise } from "./fb_io.mjs";


function gtn_readSorted() {
    let scoreArray = [];

    let gtnGameScores = "/gameScores/GTN"
    let numberToRead = 5;
    let sortkey = "score"
    const dbReference = query(ref(fb_gamedb, gtnGameScores), orderByChild(sortkey), limitToFirst(numberToRead));
    get(dbReference).then((snapshot) => {
       snapshot.forEach(function(userScoreSnapshot) {
        var scores = userScoreSnapshot.val();
        console.log(scores.score);
        let userName = userScoreSnapshot.key;
        let userScore = scores.score;
        let scoreObject = {[userName]: userScore};
        scoreArray.push(scoreObject);
       });
       console.log(scoreArray);
       displayScores(scoreArray);
    }).catch((error) => {
        console.log(error);
    });
}

function displayScores(scoreArray){
    let firstPlace = document.getElementById("first_place");
    let firstUserName = Object.keys(scoreArray[0]);
    let firstUserScore = Object.values(scoreArray[0]);
    firstPlace.innerHTML = "1. " + firstUserName + ": " + firstUserScore + " guesses";

    let secondPlace = document.getElementById("second_place");
    let secondUserName = Object.keys(scoreArray[1]);
    let secondUserScore = Object.values(scoreArray[1]);
    secondPlace.innerHTML = "2. " + secondUserName + ": " + secondUserScore + " guesses";

    let thirdPlace = document.getElementById("third_place");
    let thirdUserName = Object.keys(scoreArray[2]);
    let thirdUserScore = Object.values(scoreArray[2]);
    thirdPlace.innerHTML = "3. " + thirdUserName + ": " + thirdUserScore + " guesses";

    let fourthPlace = document.getElementById("fourth_place");
    let fourthUserName = Object.keys(scoreArray[3]);
    let fourthUserScore = Object.values(scoreArray[3]);
    fourthPlace.innerHTML = "4. " + fourthUserName + ": " + fourthUserScore + " guesses";

    let fifthPlace = document.getElementById("fifth_place");
    let fifthUserName = Object.keys(scoreArray[4]);
    let fifthUserScore = Object.values(scoreArray[4]);
    fifthPlace.innerHTML = "5. " + fifthUsername + ": " + fifthUserScore + " guesses";
}

export{
    gtn_readSorted
}