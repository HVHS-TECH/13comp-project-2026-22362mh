/***** IMPORT FUNCTIONS *****/
import { ref, get  } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import { userUid } from './register.mjs';
import { fb_gamedb } from './fb_io.mjs';

function checkUserUids(){
    var readPath = "/userData";
        const dbReference= ref(fb_gamedb, readPath);
        get(dbReference).then((snapshot) => {
            var fb_data = snapshot.val();
            if (fb_data != null) {
                console.log(fb_data);
                var allUserUids = Object.keys(fb_data);
                console.log(allUserUids);
            } else {
                console.log("No record was found");
            }
        }).catch((error) => {
            console.log(error);
        });
}

//Next step: go through the array of user uids, check if the user has already had their user uid stored for their username,
//otherwise make them sign up.

export {
    checkUserUids
}