import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getDatabase, ref, set, update } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

import { fb_gamedb } from './fb_io.mjs';

let username;
let userUid;
let userAge;

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
    })
        .catch((error) => {
            console.log(error);
        });
}

function fb_getSignUpDetails() {
    userAge = document.getElementById("userAge");
    userAge = userAge.value;
    console.log(userAge);

    if (userAge < 13 || userAge > 100 || isNaN === true) {
        alert("Please put in an age between 13 and 100!");
    }
    else {
        username = document.getElementById("username");
        username = username.value;
        console.log(username);
        storeSignUpDetails();
    }
}

function storeSignUpDetails() {
    var writePath = "/userData/" + userUid;
    var data = { "Username": username };
    const dbReference = ref(fb_gamedb, writePath);
    set(dbReference, data).then(() => {
        console.log("Username has been stored");
    }).catch((error) => {
        console.log(error);
    });

    var writePath2 = "/userData/" + userUid;
    var userAgeData = {"userAge": userAge}; //Putting them in as second player for the turns
    const dbReference2 = ref(fb_gamedb, writePath2);
    update(dbReference2, userAgeData).then(() => {
        console.log("User age has been stored!");
    }).catch((error) => {
        console.log(error);
    });
}

export {
    fb_getSignUpDetails, fb_login, userUid
}
