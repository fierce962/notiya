/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import OneSignal from 'onesignal-cordova-plugin';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SendNotification } from 'src/app/models/interface';
import { SessionsService } from '../sessions/sessions.service';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class OneSignalService {

  constructor(private http: HttpClient, private platform: Platform) { }

  oneSignalInit(sessions: SessionsService): void {
    if(this.platform.is('android')){
      OneSignal.setAppId('e1d6c6f3-0f5c-4a20-a688-75319373f280');
      OneSignal.setNotificationOpenedHandler((jsonData) => {
        const notification: any = jsonData.notification.additionalData;
        sessions.setNotification(notification);
          console.log(jsonData.notification.additionalData);
      });

      OneSignal.promptForPushNotificationsWithUserResponse((accepted) => {
          console.log('User accepted notifications: ' + accepted);
      });
    }
  }

  setExternalId(uid: string): void{
    if(this.platform.is('android')){
      OneSignal.setExternalUserId(uid);
    };
  }

  send(sendNotification: SendNotification, tokens: string[]): void{
    this.http.post('https://onesignal.com/api/v1/notifications', {
      "app_id": "e1d6c6f3-0f5c-4a20-a688-75319373f280",
      "include_external_user_ids": tokens,
      // eslint-disable-next-line object-shorthand
      "data": sendNotification,
      "contents": {"en": sendNotification.message},
      "headings": {"en": sendNotification.title}
      },
      {
        headers: new HttpHeaders({
        'Authorization': 'Bearer token=\"YTRhZmVkNGYtYjE5Zi00YjhhLThkYmItZDg3OTBiZmZlMGY5\"'
        })
      }).subscribe(res=>{
        console.log(res);
      });
  }
}
