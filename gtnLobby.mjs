/***** IMPORT FUNCTIONS *****/
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getDatabase, ref, set, get, remove, onValue } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import { update } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";

import { fb_gamedb } from "./fb_io.mjs";
import { userUid } from "./fb_io.mjs";

//GLOBAL VARIABLES
var username;
var joinCode;
var gameRoomCode;

//Getting the user's username from userData using their Uid
function getUsername() {
    var userNamePath = "/userData/" + userUid + "/Username";
    const dbReference = ref(fb_gamedb, userNamePath);
    get(dbReference).then((snapshot) => {
        var fb_data = snapshot.val();
        if (fb_data != null) {
            console.log(fb_data);
            username = fb_data;
        } else {
            console.log("No record found");
        }
    }).catch((error) => {
        console.log(error);
    });
}

function createLobby() {
    getUsername();
    var gameRoomPath = "gameRoom/GTN/" + userUid;
    var dataToWrite = { "firstPlayer": userUid };
    const dbReference = ref(fb_gamedb, gameRoomPath);
    set(dbReference, dataToWrite).then(() => {
        console.log("You have created a game room!");
        joinCode = userUid;
        leaveWaitingRoom();

        var joinCodeDisplay = document.getElementById("joinCode");
        joinCodeDisplay.innerHTML = "You have successfully made a game room! Your join code is : " + joinCode;
        joinCodeDisplay.style.display = "block";
    }).catch((error) => {
        console.log(error);
    });
}

function getGameRoomCode() {
    var codeValid = false;

    gameRoomCode = document.getElementById("gameRoomCode");
    gameRoomCode = gameRoomCode.value;
    console.log(gameRoomCode);

    var readPath = "/gameRoom/GTN";
    const dbReference = ref(fb_gamedb, readPath);
    get(dbReference).then((snapshot) => {
        var fb_data = snapshot.val();
        if (fb_data != null) {
            console.log(fb_data);
            var allGameRoomCodes = Object.keys(fb_data);
            console.log(allGameRoomCodes);
            for (let i=0; i<allGameRoomCodes.length; i++){
                if (gameRoomCode == allGameRoomCodes[i]){
                    codeValid = true;
                }
            }
            if (codeValid == true){
                joinGameRoom();
            }
            else if (codeValid == false){
                alert("The code you entered does not exist! Please enter a valid code.");
            }
        } else {
            console.log("No record was found");
        }
    }).catch((error) => {
        console.log(error);
    });
}

function leaveWaitingRoom() {
    var deleteRecord = "/lobby/GTN/" + userUid;
    const dbReference2 = ref(fb_gamedb, deleteRecord);
    remove(dbReference2).then(() => {
        console.log("You have been taken off the waiting list for GTN");
    }).catch((error) => {
        console.log(error);
    });
}

function joinGameRoom(){
    getUsername();
    var gameRoomPath = "/gameRoom/GTN/" + gameRoomCode;
    var secondPlayerData = { "secondPlayer" : userUid}; //Putting them in as second player for the turns
    const dbReference3 = ref(fb_gamedb, gameRoomPath);
    update(dbReference3, secondPlayerData).then(() => {
        console.log("You are in the game room!");
    }).catch((error) => {
        console.log(error);
    });
}

function startGame(){
    console.log("Start game");
}

export {
    createLobby, getGameRoomCode, getUsername
}