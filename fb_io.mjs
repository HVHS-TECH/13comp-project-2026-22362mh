/************************************/
// fb_io.mjs
//
// Written by Mio Hoffman, Term 1, 2026
//  Firebase functions:
// Initialise firebase
// Handles login
// Gets the user's username after logging in
/************************************/

// love the cleanly defined functions

const COL_C = 'white';	    // These two const are part of the coloured
const COL_B = '#820b8d';	//  console.log for functions scheme
console.log('%c fb_io.mjs',
    'color: blue; background-color: white;');

//Importing the needed firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

/***** GLOBAL VARIABLES *****/
// maybe use let?
var fb_gamedb;
var signedIn = false;

//Function for initialising firebase
function fb_initialise() {
    const FB_GAMECONFIG = {
        apiKey: "AIzaSyDuJnRiExxWkHuXgYW_9LpGaVLcfVYRIiE",
        authDomain: "compgamefirebase-miohoffman.firebaseapp.com",
        databaseURL: "https://compgamefirebase-miohoffman-default-rtdb.firebaseio.com",
        projectId: "compgamefirebase-miohoffman",
        storageBucket: "compgamefirebase-miohoffman.firebasestorage.app",
        messagingSenderId: "879943944137",
        appId: "1:879943944137:web:27014e6f84077c4b994a18",
        measurementId: "G-2LQPB4K734"
    };

    const FB_GAMEAPP = initializeApp(FB_GAMECONFIG);
    fb_gamedb = getDatabase(FB_GAMEAPP);
    console.info(fb_gamedb);
}

//Has the user login with google
// could use async, as it is cleaner code
function fb_login() {
    const AUTH = getAuth();
    const PROVIDER = new GoogleAuthProvider();
    // The following makes Google ask the user to select the account
    PROVIDER.setCustomParameters({
        prompt: 'select_account'
    });
    signInWithPopup(AUTH, PROVIDER).then((result) => {
        console.log("Sign in successful!");
        console.log(result);
        let loginStatus = document.getElementById("loginStatus");
        loginStatus.innerHTML = "You have logged in!";
        signedIn = true;
    })
        .catch((error) => {
            console.log(error);
        });
}
// this can be replaced with a `new FormData(formElement)`
function getFormInput() {
    //If the user is signed in, they can input a username successfully and then it'll be displayed
    if (signedIn == true) {
        //Getting the user's username from the HTML form
        var username = document.getElementById("username");
        username = username.value; //Making sure the username is the value or text that the user inputted.
        console.log(username);

        var usernameDisplay = document.getElementById("usernameDisplay");
        usernameDisplay.innerHTML = "Your username is: " + username;
    }
    //If the user isn't signed in and tries to input a username, they get alerted.
    else if (signedIn == false) {
        alert("You have not logged in yet!");
    }
}

//Exporting the needed functions
export {
    fb_initialise, fb_login, getFormInput
};