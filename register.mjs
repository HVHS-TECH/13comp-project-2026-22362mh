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

import { fb_gamedb, userUid, fb_register, userEmailRegistered } from './fb_io.mjs';

//GLOBAL VARIABLES
let username;
let userAge;

/**** Registered Already Function ****/
//This function checks if the user has already registered
//It gets all the userUids in the database under userData
//Checks if the user's uid is one of them
//Sends them to the login page if their user uid does match one of the uids already in the database
//Or it does nothing if the user uid isn't in the database already
function registeredAlready() {
    let userPath = "/userData/" + userUid;
    const dbReference = ref(fb_gamedb, userPath);
    get(dbReference).then((snapshot) => {
        var fb_data = snapshot.val();
        if (snapshot.exists()) {
            location.href = "login.html";
        }
        else {
            let registerHeading = document.getElementById("registerHeading");
            registerHeading.innerHTML = "Sign in successful! Please put in username and age!"
        }
    }).catch((error) => {
        console.log(error);
    });
}

/***** Get Sign Up Details From HTML Form *****/
//This function validates the user age and user name that the user inputs
//If either aren't valid, it sends an alert to the user telling them of the conditions for the user name and age to be valid
//If both the user name and age are valid, it calls another function to store the details under userData in firebase
function fb_getSignUpDetails() {
    if (userEmailRegistered == true) {
        userAge = document.getElementById("userAge"); //Getting the user age from the register form
        userAge = userAge.value;
        console.log(userAge);

        username = document.getElementById("username"); //After the age has been validated, it gets the username from the form
        username = username.value;
        console.log(username);

        if (userAge < 13 || userAge > 100 || userAge == null || userAge % 1 !== 0) { //Checks to make sure the user age is 13-100 and check to make sure it's a number.
            alert("Please put in an age between 13 and 100!"); //If the conditions for the age aren't met, it gives the user an alert   
        }
        else {
            console.log("Age is valid");
            var userAgeValid = true;
        }

        if (username == " " || username == "" || !isNaN(username)){
            alert("Please put in a valid username containing letters!");
        }
        else {
            console.log("Name is valid");
            var usernameValid = true;
        }

        if (usernameValid && userAgeValid){
            console.log("Username and age valid");
            storeSignUpDetails();
        }
    }
    else if (userEmailRegistered == false){
        alert("Please put in an email before you put in a username and age!");
    }
}

//This function stores the user's username and user age which they inputted in the form
//This function is only called once the user age has been validated
function storeSignUpDetails() {
    let userPath = "/userData/" + userUid;
    //Storing username in the userData section of firebase underneath the user's userUid
    var userNameData = { "Username": username };
    const dbReference = ref(fb_gamedb, userPath);
    set(dbReference, userNameData).then(() => {
        console.log("Username has been stored");
    }).catch((error) => {
        console.log(error);
    });

    //Updating the user's record to include their user age along with the username
    //It's updating the record not writing to it because writing to it overwrites the whole record
    var userAgeData = { "userAge": userAge };
    const dbReference2 = ref(fb_gamedb, userPath);
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
