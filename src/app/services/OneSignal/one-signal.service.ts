/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import OneSignal from 'onesignal-cordova-plugin';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class OneSignalService {

  constructor(private http: HttpClient) { }

  oneSignalInit(): void {
    // OneSignal.setAppId('e1d6c6f3-0f5c-4a20-a688-75319373f280');
    // OneSignal.setNotificationOpenedHandler((jsonData) => {
    //   esta es la funcion que se ispara cuando se abre la notificaicon
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

  send(title: string, mensaje: string, url: string): void{
    this.http.post('https://onesignal.com/api/v1/notifications', {
      "app_id": "e1d6c6f3-0f5c-4a20-a688-75319373f280",
      "include_player_ids": ["1166b790-8617-11ec-9c8f-aecd5c7aa51b", "e06b730e-861d-11ec-b46c-86dcbabbe057"],
      // eslint-disable-next-line object-shorthand
      "data": { "title": title, "mensaje": mensaje, "url": url },
      "contents": {"en": mensaje},
      "headings": {"en": title}
      }).subscribe(res=>{
        console.log(res);
      });
  }
}
