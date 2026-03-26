const COL_C = 'white';	    // These two const are part of the coloured
const COL_B = '#820b8d';	//  console.log for functions scheme
console.log('%c fb_io.mjs',
    'color: blue; background-color: white;');

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getDatabase,ref, set, get, remove, onValue  } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { update } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

//GLOBAL VARIABLES
var fb_gamedb;
var userUid;
var username;
var uids;
var partnerUid;
var gameRoomID;

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

    console.log("Firebase has been initialised");

    userAuthState();
}

fb_initialise();

function userAuthState(){
    const AUTH = getAuth();
    onAuthStateChanged(AUTH, (user) => {
        if (user) {
            console.log("User is logged in!");
            userUid = user.uid;
            console.log(userUid);
            getUsername();
        } else {
            console.log("User is logged out!");
        }
    }, (error) => {
        console.log(error);
    });
}

//Getting the user's username from userData using their Uid
function getUsername(){
    console.log(userUid);
    var userNamePath = "/userData/" + userUid + "/Username";
    const dbReference= ref(fb_gamedb, userNamePath);
    get(dbReference).then((snapshot) => {
        var fb_data = snapshot.val();
        if (fb_data != null) {
            console.log(fb_data);
            username = fb_data;

            waitingList();
        } else {
            console.log("No record found");
        }
    }).catch((error) => {
        console.log(error);
    });
}

//Inputting the user's uid and username in the waiting list for the GTN lobby
function waitingList(){
    var writePath = "/lobby/GTN/" + userUid;
    var dataToWrite = username;
    const dbReference= ref(fb_gamedb, writePath);
    set(dbReference, dataToWrite).then(() => {
        console.log("User is in GTN lobby waiting list!");
    }).catch((error) => {
        console.log(error);
    });
    checkWaitingList();
}

//This function needs to:
// Check the amount of players in the waiting list
// If two or more are in the waiting list, the first user on the list will randomly make a pair with another user
// The two users will need to be transferred to a game lobby.
function checkWaitingList(){
    var readPath = "/lobby/GTN";
    const dbReference= ref(fb_gamedb, readPath);
    get(dbReference).then((snapshot) => {
        console.log("Yippie, I worked!!!!!!!!!!!!!!!!!!!!!  ")
        var fb_data = snapshot.val();
        if (fb_data != null) {
            console.log(fb_data);
            uids = Object.keys(fb_data);
            console.log(uids);
                if (uids.length >= 2){
                    console.log("There are at least 2 people in the waiting list!");
                    pairUp();
                }
                else {
                    fb_onValue();
                }
        } else {
            console.log("No record was found");
        }
    }).catch((error) => {
        console.log(error);
    });
}

function fb_onValue(){
    const monitorAndRead = "/lobby/GTN"
    const dbReference = ref(fb_gamedb, monitorAndRead);
    onValue(dbReference, (snapshot) => {
        var fb_data = snapshot.val();
        if (fb_data != null) {
            console.log(fb_data);
        } else {
            console.log("No record found");
        }
    });
}

function pairUp(){
    if (userUid == uids[0]){
        console.log("You are the first person in the waiting list!");
        var maxNum = uids.length - 1;
        var partner = Math.floor(Math.random() * maxNum) + 1;
        partnerUid = uids[partner];
        console.log("Your partner is number: " + partner + " = " + partnerUid);
        createGameLobby();
    }
    else {
        console.log("You are NOT the first person in the waiting list");
    }
} 

function createGameLobby(){
    gameRoomID = userUid;

    var firstPlayerWritePath = "/gameRoomGTN/" + gameRoomID;
    var firstPlayerData = {firstPlayer: userUid};
    const dbReference= ref(fb_gamedb, firstPlayerWritePath);
    set(dbReference, firstPlayerData).then(() => {
        console.log("You are in a game lobby!");
    }).catch((error) => {
        console.log(error);
    });

    var deleteRecord = "/lobby/GTN/" + userUid;
    const dbReference2 = ref(fb_gamedb, deleteRecord);
    remove(dbReference2).then(() => {
        console.log("You have been taken off the waiting list for GTN");
    }).catch((error) => {
        console.log(error);
    });

    
    var writePath = "/gameRoomGTN/" + gameRoomID;
    var secondPlayerData = {secondPlayer: partnerUid};
    const dbReference3 = ref(fb_gamedb, writePath);
    update(dbReference3, secondPlayerData).then(() => {
        console.log("Partner is in lobby!");
    }).catch((error) => {
        console.log(error);
    });

    var deletePartnerRecord = "/lobby/GTN/" + partnerUid;
    const dbReference4 = ref(fb_gamedb, deleteRecord);
    remove(dbReference4).then(() => {
        console.log("Partner has been taken off waiting list!");
    }).catch((error) => {
        console.log(error);
    });
}