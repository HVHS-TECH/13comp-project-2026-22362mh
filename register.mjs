/************************************/
// register.mjs
//
// Written by Mio Hoffman, Term 2, 2026
// fb_getSignUpDetails: gets the user's age and username from a form they fill out and validates the age
// storeSignUpDetails: once the user age is validated, it stores the user age and username in firebase under the user's uid
/************************************/
//IMPORTING FUNCTIONS
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getDatabase, ref, set, get, update } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

import { fb_gamedb, userUid, fb_register } from './fb_io.mjs';

//GLOBAL VARIABLES
let username;
let userAge;

function registeredAlready(){
    let userUidsPath = "/userData";
    const dbReference= ref(fb_gamedb, userUidsPath);
    get(dbReference).then((snapshot) => {
        var fb_data = snapshot.val();
        if (fb_data != null) {
            let userUids = Object.keys(fb_data);
            console.log(userUids);
            const MAX = userUids.length
            for (let i=0; i<MAX; i++){
                if (userUids = userUid){
                    let userRegistered = true;
                    sessionStorage.setItem("userRegistered", userRegistered);
                    location.href="login.html";
                }
            }
        } else {
            console.log("No record found!");
        }
    }).catch((error) => {
        console.log(error);
    });
}

function fb_getSignUpDetails() {
    userAge = document.getElementById("userAge"); //Getting the user age from the register form
    userAge = userAge.value;
    console.log(userAge);

    if (userAge < 13 || userAge > 100 || isNaN === true) { //Checks to make sure the user age is 13-100 and check to make sure it's a number.
        alert("Please put in an age between 13 and 100!"); //If the conditions for the age aren't met, it gives the user an alert
    }
    else {
        username = document.getElementById("username"); //After the age has been validated, it gets the username from the form
        username = username.value;
        console.log(username);
        storeSignUpDetails(); //Once both the user age and username are taken from the form, a function is called to store them in firebase
    }
}

//This function stores the user's username and user age which they inputted in the form
//This function is only called once the user age has been validated
function storeSignUpDetails() {
    //Storing username in the userData section of firebase underneath the user's userUid
    var writePath = "/userData/" + userUid;
    var data = { "Username": username };
    const dbReference = ref(fb_gamedb, writePath);
    set(dbReference, data).then(() => {
        console.log("Username has been stored");
    }).catch((error) => {
        console.log(error);
    });

    //Updating the user's record to include their user age along with the username
    //It's updating the record not writing to it because writing to it overwrites the whole record
    var writePath2 = "/userData/" + userUid;
    var userAgeData = { "userAge": userAge };
    const dbReference2 = ref(fb_gamedb, writePath2);
    update(dbReference2, userAgeData).then(() => {
        console.log("User age has been stored!");
    }).catch((error) => {
        console.log(error);
    });

    let gameSelectionButton = document.getElementById("gameSelection");
    gameSelectionButton.style.display = "block";
}

//Exporting functions to be used in buttons
export {
    fb_getSignUpDetails, registeredAlready
}
