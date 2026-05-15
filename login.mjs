/************************************/
// login.mjs
//
// Written by Mio Hoffman, Term 2, 2026
// checkUserUids: checks if the user's uid has already been stored in firebase (meaning they've already registered)
/************************************/
/***** IMPORT FUNCTIONS *****/
import { ref, get } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import { userUid } from './fb_io.mjs';
import { fb_gamedb } from './fb_io.mjs';

let accountMade = false;
let username;

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
            var allUserUids = Object.keys(fb_data); //Saves all registered user uids into an array
            console.log(allUserUids);

            console.log(userUid);

            //Checks if the user's uid has been saved before
            //If it has, they have made an account
            //If it hasn't, they need to register
            for (let i=0; i<allUserUids.length; i++){
                if (userUid == allUserUids[i]){
                    accountMade = true;
                }
            }

            //If the user has made an account, a function is called to get their username
            if (accountMade == true){
                console.log("You have an account!");
                getUserName();
            }
            else if (accountMade == false){ //If the user hasn't registered an account yet, they get an alert
                let registerButton = document.getElementById("registerButton");
                registerButton.style.display = "block";

                alert("You have not made an account yet! Please go to the register page and register an account.");
            }
        } else {
            console.log("No record was found");
        }
    }).catch((error) => {
        console.log(error);
    });
}

//This function gets the user's username to display to them
function getUserName(){
    var readPath = "/userData/" + userUid + "/Username";
    const dbReference = ref(fb_gamedb, readPath);
    get(dbReference).then((snapshot) => {
        var fb_data = snapshot.val();
        if (fb_data != null) {
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
        } else {
            console.log("No record was found");
        }
    }).catch((error) => {
        console.log(error);
    });
}

//EXPORT FUNCTIONS
export {
    checkUserUids, username
}