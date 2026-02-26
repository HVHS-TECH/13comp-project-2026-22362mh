const COL_C = 'white';	    // These two const are part of the coloured
const COL_B = '#820b8d';	//  console.log for functions scheme
console.log('%c fb_io.mjs',
            'color: blue; background-color: white;');

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

var fb_gamedb;

function fb_initialise(){
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
    fb_gamedb= getDatabase(FB_GAMEAPP);
    console.info(fb_gamedb);
}

export {
    fb_initialise
};