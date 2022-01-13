import { Injectable } from '@angular/core';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token
} from '@capacitor/push-notifications';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationPushService {

  constructor(private storage: StorageService,) { }

  registerDevice(): void{
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        PushNotifications.register();
        this.listenerNotification();
      } else {
      }
    });
  }

  private listenerNotification(): void{
    PushNotifications.addListener('registration',
    (token: Token) => {
      console.log(token.value);
    });

    PushNotifications.addListener('registrationError',
    (error: any) => {
      console.log(error);
    });

    PushNotifications.addListener('pushNotificationReceived',
    (notification: PushNotificationSchema) => {
      console.log('nueva', notification);
      this.storage.saveNotification('notification', notification.data.save);
    });

    PushNotifications.addListener('pushNotificationActionPerformed',
    (notification: ActionPerformed) => {
      console.log('nueva2', notification);
      this.storage.saveNotification('notification', notification.notification.data.save);
    });
  }

}
