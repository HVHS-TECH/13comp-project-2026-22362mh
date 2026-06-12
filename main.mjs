/************************************/
// main.mjs
//
// Written by Mio Hoffman, Term 1, 2026
//  imports functions to be used in html buttons or other modules
//  includes functions from:
//      fb_io.mjs
//      register.mjs
//      login.mjs
//      gtnLobby.mjs
//      gtn.mjs
//      appleAttackScores.mjs
//      gtnLeaderboard.mjs
/************************************/

/***** Functions imported from fb_io.mjs *****/
import { fb_initialise, userAuthState, userAuthStateThenStart, fb_login, fb_register }
    from './fb_io.mjs';
window.userAuthState = userAuthState;
window.userAuthStateThenStart = userAuthStateThenStart;
window.fb_login = fb_login;
window.fb_register = fb_register;
window.fb_initialise = fb_initialise;

/***** Functions imported from register.mjs and login.mjs *****/
import { fb_getSignUpDetails }
    from './register.mjs';
window.fb_getSignUpDetails = fb_getSignUpDetails;


/***** Functions imported from gtnLobby.mjs *****/
import { createLobby }
    from './gtnLobby.mjs';
window.createLobby = createLobby;

import { getGameRoomCode }
    from './gtnLobby.mjs';
window.getGameRoomCode = getGameRoomCode;


/***** Functions imported from gtn.mjs *****/
import { getNumber }
    from './gtn.mjs';
window.getNumber = getNumber;

import { gameStart }
    from './gtn.mjs';
window.gameStart = gameStart;

import { getGuess }
    from './gtn.mjs';
window.getGuess = getGuess;


/***** Functions imported from the leaderboard javascript modules*****/
import { aa_readSorted }
    from './appleAttackScores.mjs';
window.aa_readSorted = aa_readSorted;

import { gtn_readSorted }
    from './gtnLeaderboard.mjs';
window.gtn_readSorted = gtn_readSorted;