import { Injectable } from '@angular/core';
import OneSignal from 'onesignal-cordova-plugin';

@Injectable({
  providedIn: 'root'
})
export class OneSignalService {

  constructor() { }

  oneSignalInit(): void {
    // OneSignal.setAppId('e1d6c6f3-0f5c-4a20-a688-75319373f280');
    // OneSignal.setNotificationOpenedHandler((jsonData) => {
    //     console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    // });

    // OneSignal.promptForPushNotificationsWithUserResponse((accepted) => {
    //     console.log('User accepted notifications: ' + accepted);
    // });
  }

  async getPlayerId(): Promise<string>{
    // return new Promise(resolve=>{
    //   OneSignal.addSubscriptionObserver((state) =>{
    //     resolve(state.to.userId);
    //   });
    // });
    return 'hola';
  }
}
