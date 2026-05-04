/***** IMPORT FUNCTIONS *****/
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getDatabase, ref, set, get, remove, onValue } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import { update } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";

/***** IMPORTING VARIABLES *****/
import { fb_gamedb } from "./fb_io.mjs";
import { userUid } from "./fb_io.mjs";

//GLOBAL VARIABLES
var username;
var joinCode;
var gameRoomCode;

//This function makes a game room under the user's UID
function createLobby() {
    getFirstPlayerUsername();
    var gameRoomPath = "gameRoom/GTN/" + userUid;
    var dataToWrite = { "firstPlayer": userUid };
    const dbReference = ref(fb_gamedb, gameRoomPath);
    set(dbReference, dataToWrite).then(() => {
        console.log("You have created a game room!");
        joinCode = userUid;
        checkGameRoomPlayers(); //Calls a function to check when the game room updates so it can check for a second player

        //Displays the user's join code for their game room
        var joinCodeDisplay = document.getElementById("joinCode");
        joinCodeDisplay.innerHTML = "You have successfully made a game room! Your join code is : " + joinCode;
        joinCodeDisplay.style.display = "block";
    }).catch((error) => {
        console.log(error);
    });
}

//This function:
//Gets the game room code the user inputted
//Checks if it is an existing and valid game room code for any of the game rooms
//Calls the joinGameRoom function if it is valid
//Alerts the user that their code isn't valid if it isn't valid
function getGameRoomCode() {
    var codeValid = false;

    //Getting the game room code the user inputted into the html form.
    gameRoomCode = document.getElementById("gameRoomCode");
    gameRoomCode = gameRoomCode.value;
    console.log(gameRoomCode);

    //Reading all the game room codes for Guess the Number
    var readPath = "/gameRoom/GTN";
    const dbReference = ref(fb_gamedb, readPath);
    get(dbReference).then((snapshot) => {
        var fb_data = snapshot.val();
        if (fb_data != null) {
            console.log(fb_data);
            var allGameRoomCodes = Object.keys(fb_data); //Gets all the game room codes into an array
            console.log(allGameRoomCodes);
            //This for loop checks if the game code inputted by the user matches any of the codes in the game room code array.
            for (let i = 0; i < allGameRoomCodes.length; i++) {
                if (gameRoomCode == allGameRoomCodes[i]) {
                    codeValid = true;
                }
            }
            if (codeValid == true) { //Calls this function if the inputted game code is valid
                joinGameRoom();
            }
            else if (codeValid == false) { //If the game code isn't valid, the user is alerted
                alert("The code you entered does not exist! Please enter a valid code.");
            }
        } else {
            console.log("No record was found");
        }
    }).catch((error) => {
        console.log(error);
    });
}

//This function puts the user into the game room that matches the code they entered
function joinGameRoom() {
    getSecondPlayerUsername();
    var gameRoomPath = "/gameRoom/GTN/" + gameRoomCode;
    var secondPlayerData = { "secondPlayer": userUid }; //Putting them in as second player for the turns
    const dbReference3 = ref(fb_gamedb, gameRoomPath);
    update(dbReference3, secondPlayerData).then(() => {
        console.log("You are in the game room!");
        checkGameRoomPlayers2(); //Calls a function to check if two players are in the same game room the user is in
    }).catch((error) => {
        console.log(error);
    });
}

//Getting the user's username from userData using their Uid
function getFirstPlayerUsername() {
    var userNamePath = "/userData/" + userUid + "/Username";
    const dbReference = ref(fb_gamedb, userNamePath);
    get(dbReference).then((snapshot) => {
        var fb_data = snapshot.val();
        if (fb_data != null) {
            console.log(fb_data);
            username = fb_data;
            var gameRoomUsernamePath = "/gameRoom/GTN/" + userUid; //Path for the game room
            var usernameData = {"firstPlayerUsername" : username}; //Username data to write into the game room
            const dbReference = ref(fb_gamedb, gameRoomUsernamePath);
            update(dbReference, usernameData).then(() => {
                console.log("Username is stored into game room!");
            }).catch((error) => {
                console.log(error);
            });
        } else {
            console.log("No record found");
        }
    }).catch((error) => {
        console.log(error);
    });
}

//Getting the user's username from userData using their Uid
function getSecondPlayerUsername() {
    var userNamePath = "/userData/" + userUid + "/Username";
    const dbReference = ref(fb_gamedb, userNamePath);
    get(dbReference).then((snapshot) => {
        var fb_data = snapshot.val();
        if (fb_data != null) {
            console.log(fb_data);
            username = fb_data;
            var gameRoomUsernamePath = "/gameRoom/GTN/" + gameRoomCode; //Path for the game room
            var usernameData = {"secondPlayerUsername" : username}; //Username data to write into it
            const dbReference = ref(fb_gamedb, gameRoomUsernamePath);
            update(dbReference, usernameData).then(() => {
                console.log("Username is stored into game room!");
            }).catch((error) => {
                console.log(error);
            });
        } else {
            console.log("No record found");
        }
    }).catch((error) => {
        console.log(error);
    });
}

//This function checks if two people are in the game room the user is in if they created the game room
function checkGameRoomPlayers() {
    //Checking the room every time it updates
    var readAndMonitorPath = "gameRoom/GTN/" + userUid;
    const dbReference = ref(fb_gamedb, readAndMonitorPath);
    onValue(dbReference, (snapshot) => {
        var fb_data = snapshot.val();
        if (fb_data != null) {
            console.log(fb_data);

            //Reading the game room to check if there are two players in it
            var readPath = "/gameRoom/GTN/" + userUid;
            const dbReference = ref(fb_gamedb, readPath);
            get(dbReference).then((snapshot) => {
                var fb_data = snapshot.val();
                if (fb_data != null) {
                    console.log(fb_data);
                    var players = Object.keys(fb_data);
                    console.log(players);
                    //Checks if there is a first player and second player in the game room so the user can go to the game screen
                    if (players[0] == 'firstPlayer' && players[2] == 'secondPlayer') {
                        console.log("Both players are in the game room!");
                        window.location.href = "gtnGameScreen.html"; //Changing screen to the game screen
                    }
                } else {
                    console.log("No record was found");
                }

            }).catch((error) => {
                console.log(error);
            });
        } else {
            console.log("No record found");
        }
    });
}

//This function checks if two people are in the game room the user is in if they joined a game room
function checkGameRoomPlayers2() {
    //Checking the room every time it updates
    var readAndMonitorPath = "gameRoom/GTN/" + gameRoomCode;
    const dbReference = ref(fb_gamedb, readAndMonitorPath);
    onValue(dbReference, (snapshot) => {
        var fb_data = snapshot.val();
        if (fb_data != null) {
            console.log(fb_data);

            //Reading the game room to check if two players are in it
            var readPath = "/gameRoom/GTN/" + gameRoomCode;
            const dbReference = ref(fb_gamedb, readPath);
            get(dbReference).then((snapshot) => {
                var fb_data = snapshot.val();
                if (fb_data != null) {
                    console.log(fb_data);
                    var players = Object.keys(fb_data);
                    console.log(players);
                    //Checks if there is a first player and second player in the game room so the user can go to the game screen
                    if (players[0] == 'firstPlayer' && players[2] == 'secondPlayer') {
                        console.log("Both players are in the game room!");
                        window.location.href = "gtnGameScreen.html";
                    }
                } else {
                    console.log("No record was found");
                }

            }).catch((error) => {
                console.log(error);
            });
        } else {
            console.log("No record found");
        }
    });
}

//EXPORTING FUNCTIONS
export {
    createLobby, getGameRoomCode
}