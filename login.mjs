/************************************/
// login.mjs
//
// Written by Mio Hoffman, Term 2, 2026
// checkUserUids: checks if the user's uid has already been stored in firebase (meaning they've already registered)
/************************************/
/***** IMPORT FUNCTIONS *****/
import { ref, get } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import { userUid, signedIn } from './fb_io.mjs';
import { fb_gamedb } from './fb_io.mjs';

let accountMade;

//This function:
//Checks all user uids stored in userData in firebase
//Checks if the user's uid is one of them
//If one of them is: they have created an account and the system displays their username
//If none are: the system alerts them they have not registered an account yet
function checkUserUids() {
    var readPath = "/userData";
    const dbReference = ref(fb_gamedb, readPath);
    get(dbReference).then((snapshot) => {
        var fb_data = snapshot.val();
        if (fb_data != null) {
            console.log(fb_data);
            var allUserUids = Object.keys(fb_data);
            console.log(allUserUids);
        } else {
            console.log("No record was found");
        }
    }).catch((error) => {
        console.log(error);
    });
}

//Next step: go through the array of user uids, check if the user has already had their user uid stored for their username,
//otherwise make them sign up.

export {
    checkUserUids
}