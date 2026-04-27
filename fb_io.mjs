/************************************/
// fb_io.mjs
//
// Written by Mio Hoffman, Term 1, 2026
//  Firebase functions:
// Initialise firebase
// Handles login
/************************************/

const COL_C = 'white';	    // These two const are part of the coloured
const COL_B = '#820b8d';	//  console.log for functions scheme
console.log('%c fb_io.mjs',
    'color: blue; background-color: white;');

//Importing the needed firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

import { checkUserUids } from "./login.mjs";

/***** GLOBAL VARIABLES *****/
var fb_gamedb;
var userUid;
var username;

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

function fb_register() {
    const AUTH = getAuth();
    const PROVIDER = new GoogleAuthProvider();
    // The following makes Google ask the user to select the account
    PROVIDER.setCustomParameters({
        prompt: 'select_account'
    });
    signInWithPopup(AUTH, PROVIDER).then((result) => {
        console.log("Sign in successful!");
        console.log(result);

        userUid = result.user.uid;
        console.log(userUid);
    })
        .catch((error) => {
            console.log(error);
        });
}

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

        userUid = result.user.uid;
        console.log(userUid);

        checkUserUids();
    })
        .catch((error) => {
            console.log(error);
        });
}

//Logging the user back in as a new html page loads
function userAuthState() {
    const AUTH = getAuth();
    onAuthStateChanged(AUTH, (user) => {
        if (user) {
            console.log("User is logged in!");
            userUid = user.uid; //Getting back their user uid
            console.log(userUid);
        } else {
            console.log("User is logged out!");
        }
    }, (error) => {
        console.log(error);
    });
}

//Exporting the needed functions
export {
    fb_initialise, fb_gamedb, fb_register, fb_login, userUid, userAuthState
}