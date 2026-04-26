/************************************/
// main.mjs
//
// Written by Mio Hoffman, Term 1, 2026
//  imports functions to be used in html buttons
/************************************/

import { fb_initialise }
    from './fb_io.mjs';
window.fb_initialise = fb_initialise;

import { fb_getSignUpDetails }
    from './register.mjs';
window.fb_getSignUpDetails = fb_getSignUpDetails;

import { fb_register }
    from './fb_io.mjs';
window.fb_register = fb_register;

import { fb_login }
    from './fb_io.mjs';
window.fb_login = fb_login;

import { createLobby }
    from './gtnLobby.mjs';
window.createLobby = createLobby;

import { getGameRoomCode }
    from './gtnLobby.mjs';
window.getGameRoomCode = getGameRoomCode;