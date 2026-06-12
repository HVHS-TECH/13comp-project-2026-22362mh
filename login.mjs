/************************************/
// login.mjs
//
// Written by Mio Hoffman, Term 2, 2026
/************************************/
/***** IMPORT FUNCTIONS *****/
import { ref, get } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import { userUid, fb_gamedb } from './fb_io.mjs';

let accountMade = false;
let username;

//This function gets the user's username to display to them
function getUserName() {
    var readPath = "/userData/" + userUid + "/Username";
    const dbReference = ref(fb_gamedb, readPath);
    get(dbReference).then((snapshot) => {
        if (snapshot.exists()) {
            var fb_data = snapshot.val();
            username = fb_data;
            console.log(username);

            //Displaying the user's username using HTML
            let usernameDisplay = document.getElementById("usernameDisplay");
            //usernameDisplay = usernameDisplay.value;
            usernameDisplay.innerHTML = "Your username is: " + username;
            usernameDisplay.style.display = "block";

            //After their username has been displayed, the button to go to the game selection page appears
            let gameSelectionButton = document.getElementById("gameSelection");
            gameSelectionButton.style.display = "block";
        }
        else {
            location.href = "register.html";
        }
    }).catch((error) => {
        console.log(error);
    });
}

//EXPORT FUNCTIONS
export {
    username, getUserName
}