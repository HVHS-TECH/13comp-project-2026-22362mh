/***** IMPORT FUNCTIONS *****/
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getDatabase, ref, set, get, remove, onValue, onChildAdded, onDisconnect } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import { update } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";

/***** IMPORTING VARIABLES *****/
import { fb_gamedb, userUid } from "./fb_io.mjs";

//GLOBAL VARIABLES
var joinCode;
var gameRoomCode;
var username;

function listenerFunctions() {
    displayLobbies();
}

function getUsername() {
    var usernamePath = "/userData/" + userUid + "/Username"
    const dbReference = ref(fb_gamedb, usernamePath);
    get(dbReference).then((snapshot) => {
        var fb_data = snapshot.val();
        if (fb_data != null) {
            username = fb_data;
            createLobby();
        } else {
            console.log("Uh oh! Username not found.");
        }
    }).catch((error) => {
        console.log(error);
    });
}

//This function makes a game room under the user's UID
function createLobby() {
    storeFirstPlayerUsername();
    var gameRoomPath = "gameRoom/GTN/" + userUid;
    var dataToWrite = { "firstPlayer": userUid };
    const dbReference = ref(fb_gamedb, gameRoomPath);
    set(dbReference, dataToWrite).then(() => {
        checkGameRoomPlayers(); //Calls a function to check when the game room updates so it can check for a second player

        //Displays the user's join code for their game room
        var createDisplay = document.getElementById("createDisplay");
        createDisplay.innerHTML = "You have successfully made a lobby!"
        createDisplay.style.display = "block";
    }).catch((error) => {
        console.log(error);
    });

    var firstPlayerTurn = { "playerTurn": "first" };
    var writePath = "gameRoom/GTN/" + userUid;
    const dbReference2 = ref(fb_gamedb, writePath);
    update(dbReference2, firstPlayerTurn).then(() => {
        console.log("first player is in game room");
    }).catch((error) => {
        console.log(error);
    });
    lobbyDisconnect();
    deleteDisplayingLobbies();
}

function lobbyDisconnect() {
    var gameRoomPath = "/gameRoom/GTN/" + userUid;
    onDisconnect(ref(fb_gamedb, gameRoomPath)).remove()
}

function addToListOfLobbies() {
    var lobbyListPath = "/lobbyList";
    var addedLobby = { [username]: userUid };
    const dbReference = ref(fb_gamedb, lobbyListPath);
    update(dbReference, addedLobby).then(() => {
        console.log("Lobby list is updated");

    }).catch((error) => {
        console.log("Couldn't add to lobby list cause of following error: " + error);
    });
}

function displayLobbies() {
    var lobbies = [];
    const dbReference = ref(fb_gamedb, "/lobbyList");
    onChildAdded(dbReference, (snapshot) => {
        var lobbyName = snapshot.key;
        var lobbyCode = snapshot.val();
        console.log(lobbyCode);
        var lobbyDisplay = document.getElementById("lobbyDisplay");
        lobbyDisplay.innerHTML += `<p id="${lobbyName}">` + lobbyName + "</p>";

        var lobbyButton = document.getElementById("lobbyButtons");
        lobbyButton.innerHTML += `<button id="${lobbyCode}", onclick=getCode()>Join</button>`;
    });
}

function deleteDisplayingLobbies() {
    var lobbiesPath = "/lobbyList" + username;
    onDisconnect(ref(fb_gamedb, lobbiesPath)).remove()
}

function getCode() {
    document.addEventListener("click", function (event) { //Computer is checking if the user clicks a button
        gameRoomCode = event.target.id;
        console.log(event.target.id); //Reading the id of the button which is the game code of the game room someone created
        storeSecondPlayerInfo();
    });
}

//Getting the user's username from userData using their Uid
function storeFirstPlayerUsername() {
    var gameRoomUsernamePath = "/gameRoom/GTN/" + userUid; //Path for the game room
    var usernameData = { "firstPlayerUsername": username }; //Username data to write into the game room
    const dbReference = ref(fb_gamedb, gameRoomUsernamePath);
    update(dbReference, usernameData).then(() => {
        addToListOfLobbies();
    }).catch((error) => {
        console.log(error);
    });

    checkGameRoomPlayers();
}

//Getting the user's username from userData using their Uid
function storeSecondPlayerInfo() {
    var secondPlayerUsername = fb_data;
    var gameRoomUsernamePath = "/gameRoom/GTN/" + gameRoomCode; //Path for the game room
    var usernameData = { "secondPlayer": userUid }; //Username data to write into it
    const dbReference = ref(fb_gamedb, gameRoomUsernamePath);
    update(dbReference, usernameData).then(() => {
        console.log("Username is stored into game room!");
    }).catch((error) => {
        console.log(error);
    });

    checkGameRoomPlayers2();
}

//This function checks if two people are in the game room the user is in if they created the game room
function checkGameRoomPlayers() {
    var firstPlayerIn = false;
    var secondPlayerIn = false;

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
                    for (let i = 0; i < players.length; i++) {
                        if (players[i] == "firstPlayer") {
                            firstPlayerIn = true;
                        }
                        else if (players[i] == "secondPlayer") {
                            secondPlayerIn = true;
                        }
                    }
                    if (firstPlayerIn == true && secondPlayerIn == true) {
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

/***** Check Game Room Players 2 function*****/
//This function is essentially identical to checkGameRoomPlayers function
function checkGameRoomPlayers2() {
    var firstPlayerIn = false;
    var secondPlayerIn = false;

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
                    for (let i = 0; i < players.length; i++) {
                        if (players[i] == "firstPlayer") {
                            firstPlayerIn = true;
                        }
                        else if (players[i] == "secondPlayer") {
                            secondPlayerIn = true;
                        }
                    }
                    if (firstPlayerIn == true && secondPlayerIn == true) {
                        sessionStorage.setItem("gameRoomCode", gameRoomCode);
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
    listenerFunctions, getCode, getUsername
}