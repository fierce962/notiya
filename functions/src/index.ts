import * as functions from "../node_modules/firebase-functions";

export const sendNotification = functions.firestore
    .document("/sendNotifications")
    .onWrite(async (event)=>{
      console.log(event);
    });
