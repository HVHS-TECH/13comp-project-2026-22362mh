//FIREBASE SCORE INPUT
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import { ref, set, query, orderByChild, limitToFirst, get, child } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";

import { userUid } from "./fb_io.mjs";
import { userScore as appleAttackScore } from "./appleAttack.mjs";
import { username as userName } from "./login.mjs"

import { fb_gamedb, fb_initialise } from "./fb_io.mjs";

let uid;
fb_initialise();

function aa_readSorted() {
    let AppleAttackGameScores = "/gameScores/appleAttack"
    let numberToRead = 5;
    let sortkey = "score"
    const dbReference = query(ref(fb_gamedb, AppleAttackGameScores), orderByChild(sortkey),
        limitToFirst(numberToRead));
    get(dbReference).then((snapshot) => {
        var fb_data = snapshot.val();
        if (fb_data != null) {
            console.log(fb_data);
        } else {
            console.log("No record found");
        }
    }).catch((error) => {
        console.log(error);
    });
}

export {
    aa_readSorted
}