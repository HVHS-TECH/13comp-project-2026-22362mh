const COL_C = 'white';	    // These two const are part of the coloured
const COL_B = '#820b8d';	//  console.log for functions scheme
console.log('%c fb_io.mjs',
    'color: blue; background-color: white;');

/***** IMPORT FUNCTIONS *****/
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getDatabase,ref, set, get, remove, onValue  } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { update } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";

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

//Logging the user back in as a new html page loads
function userAuthState(){
    const AUTH = getAuth();
    onAuthStateChanged(AUTH, (user) => {
        if (user) {
            console.log("User is logged in!");
            userUid = user.uid; //Getting back their user uid
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

//This function:
// Checks the amount of players in the waiting list
// If two or more are in the waiting list, the pairUp function is called
// If there aren't at least two users in the waiting list, the onValue function is called
function checkWaitingList(){
    var readPath = "/lobby/GTN";
    const dbReference= ref(fb_gamedb, readPath);
    get(dbReference).then((snapshot) => {
        var fb_data = snapshot.val();
        if (fb_data != null) {
            console.log(fb_data);
            uids = Object.keys(fb_data); //Getting the uids which are keys of the objects in the waiting list as an array
            console.log(uids);
                if (uids.length >= 2){ //If the length of the array is at least 2, there are two or more people in the waiting list
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

//This function checks to see if the waiting list has updated
function fb_onValue(){
    const monitorAndRead = "/lobby/GTN"
    const dbReference = ref(fb_gamedb, monitorAndRead);
    onValue(dbReference, (snapshot) => {
        var fb_data = snapshot.val();
        if (fb_data != null) {
            console.log(fb_data);

            checkWaitingList();
        } else {
            console.log("No record found");
        }
    });
}

function pairUp(){
    if (userUid == uids[0]){ //If the user is the first person in the waiting list
        console.log("You are the first person in the waiting list!");
        var maxNum = uids.length - 1; //The number of people in the waiting list apart from the user so they don't pair up with themself
        var partner = Math.floor(Math.random() * maxNum) + 1; //Getting random number for waiting list array other than 0 which is the first position
        partnerUid = uids[partner]; //Getting the partner's uid with the list of uids with the partner number in the list
        console.log("Your partner is number: " + partner + " = " + partnerUid);
        createGameLobby();
    }
    else {
        console.log("You are NOT the first person in the waiting list");
    }
}

function createGameLobby(){
    gameRoomID = partnerUid;

    //Putting the first player in the game room with the id being their user UID
    var firstPlayerWritePath = "/gameRoomGTN/" + gameRoomID;
    var firstPlayerData = {firstPlayer: userUid}; //Putting them in as the first player for the turns
    const dbReference= ref(fb_gamedb, firstPlayerWritePath);
    set(dbReference, firstPlayerData).then(() => {
        console.log("You are in a game lobby!");
    }).catch((error) => {
        console.log(error);
    });

    //Deleting the first player from the waiting list
    var deleteRecord = "/lobby/GTN/" + userUid;
    const dbReference2 = ref(fb_gamedb, deleteRecord);
    remove(dbReference2).then(() => {
        console.log("You have been taken off the waiting list for GTN");
    }).catch((error) => {
        console.log(error);
    });

    //Putting the first player's partner in the game room as the second player
    var writePath = "/gameRoomGTN/" + gameRoomID;
    var secondPlayerData = {secondPlayer: partnerUid}; //Putting them in as second player for the turns
    const dbReference3 = ref(fb_gamedb, writePath);
    update(dbReference3, secondPlayerData).then(() => {
        console.log("Partner is in lobby!");
    }).catch((error) => {
        console.log(error);
    });

    //Deleting the partner from the waiting list
    var deletePartnerRecord = "/lobby/GTN/" + partnerUid;
    const dbReference4 = ref(fb_gamedb, deletePartnerRecord);
    remove(dbReference4).then(() => {
        console.log("Partner has been taken off waiting list!");
    }).catch((error) => {
        console.log(error);
    });

    location.href="gtnGameScreen.html";
}