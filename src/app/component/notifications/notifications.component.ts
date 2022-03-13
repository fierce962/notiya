import { Component, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { SessionsService } from '../../services/sessions/sessions.service';
import { SendNotification, SubsCriptions, Subscription } from '../../models/interface';
import { AppLauncher } from '@capacitor/app-launcher';
import { StorageService } from 'src/app/services/storage/storage.service';
import { DatabaseService } from 'src/app/services/dataBase/database.service';
import { NotificationThumbnailService } from 'src/app/services/notificationThumbnail/notification-thumbnail.service';

import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {

  @Input() pageName: string;

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  notification: SendNotification[] = [];
  subscribedCopy: SubsCriptions;

  search = true;

  notLoadNotification = false;

  noSendNotification = false;

  constructor(private sessions: SessionsService, private database: DatabaseService,
    private ng: NgZone, private storage: StorageService,
    private thumbnail: NotificationThumbnailService) { }

  async ngOnInit() {
    if(this.pageName === 'tab1'){
      await this.startApp();
      this.startObservable();
    }else{
      await this.hasSendNotification();
    }
  }

  async hasSendNotification(): Promise<void>{
    const notificationDb: any = await this.database.getNotifications([this.sessions.user.uid]);
    if(notificationDb.length !== 0){
      const notification: SendNotification = notificationDb[0].data();
      this.thumbnail.set(notification);
      this.notification.push(notification);
    }else{
      this.noSendNotification = true;
    }
  }

  async startApp(): Promise<void>{
    this.subscribedCopy = JSON.parse(this.storage.getItemStore('subscribed'));
    this.hasSubscriptions();
    if(this.sessions.receivedNotification !== undefined){
      this.thumbnail.set(this.sessions.receivedNotification);
      this.notification.push(this.sessions.receivedNotification);
      this.removePerIdUser(this.subscribedCopy.subsCriptions, this.sessions.receivedNotification.uid);
    }
    if(this.subscribedCopy !== null){
      this.searchNotifications([... this.subscribedCopy.subsCriptions]);
    };
    await this.thumbnail.start();
  }

  hasSubscriptions(): void{
    if(this.subscribedCopy !== null && this.subscribedCopy.subsCriptions.length === 0){
      this.subscribedCopy = null;
    };
  }

  startObservable(): void{
    this.sessions.getNotification().subscribe(notification=>{
      this.ng.run(()=>{
        this.thumbnail.set(notification);
        this.notification.unshift(notification);
      });
    });

    this.sessions.getNewSubscriptions().subscribe(newSubscritions=>{
      this.ng.run(()=>{
        if(newSubscritions.length !== 0){
          if(this.subscribedCopy === null){
            this.subscribedCopy = {
              uid: this.sessions.user.uid,
              subsCriptions: []
            };
          }
          newSubscritions.forEach(subscribed=>{
            this.subscribedCopy.subsCriptions.unshift(subscribed);
          });
          if(this.notification.length < 10){
            this.searchNotifications(this.subscribedCopy.subsCriptions);
          }
          this.sessions.newSubscriptions = [];
        };
      });
    });

    this.sessions.removeSubscription$.subscribe(idUser =>{
      this.ng.run(()=>{
        this.removePerIdUser(this.notification, idUser);
        this.removePerIdUser(this.subscribedCopy.subsCriptions, idUser);
        this.hasSubscriptions();
      });
    });
  }

  async searchNotifications(subscritions: Subscription[]): Promise<void>{
    if(subscritions !== undefined && subscritions.length !== 0){
      const subscritionId: string[] = [];
      const invalidUrl: object = {};
      let numberChange = 0;
      subscritions.forEach((subscrition, index)=>{
        if(index < 10){
          invalidUrl[subscrition.uid] = subscrition.url;
          subscritionId.push(subscrition.uid);
          this.subscribedCopy.subsCriptions.shift();
          numberChange++;
        }
      });
      const notifications = await this.database.getNotifications(subscritionId);
      await this.setNotification(notifications, invalidUrl);
      this.changePositionSubscriptions(numberChange);
      if(this.notification.length < 10){
        this.searchNotifications([... this.subscribedCopy.subsCriptions]);
      }
    }else{
      this.search = false;
    }
  }

  async setNotification(notifications, invalidUrl: object): Promise<void>{
    const dateValid: string[] = this.getSearchDay();
    const end: number = notifications.length - 1;
    notifications.forEach((notification: any) => {
      const newNotification: SendNotification = notification.data();
      if(invalidUrl[newNotification.uid] !== newNotification.url){
        dateValid.forEach(day=>{
          if(day === newNotification.date){
            this.thumbnail.set(newNotification);
            this.notification.push(newNotification);
          }
        });
      }
    });
  }


  changePositionSubscriptions(numberChange: number): void{
    const subscribed: SubsCriptions = JSON.parse(this.storage.getItemStore('subscribed'));
    const removeSubscriptinos: Subscription[] = subscribed.subsCriptions.splice(0, numberChange);
    removeSubscriptinos.forEach(subscritions=>{
      subscribed.subsCriptions.push(subscritions);
    });
    this.storage.setItemStore('subscribed', JSON.stringify(subscribed));
  }

  getSearchDay(){
    const searchDate: string[] = [];
    const date: Date = new Date();
    const lastDay: number = new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();
    if(date.getDate() === lastDay){
      searchDate.push(`${date.getDate()}-${date.getMonth()}`);
      searchDate.push(`${date.getDate()-1}-${date.getMonth()}`);
      searchDate.push(`1-${date.getMonth()+1}`);
    }else if(date.getDate() === 1){
      const previousMonthLastDay: number = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
      searchDate.push(`1-${date.getMonth()}`);
      searchDate.push(`${date.getDate()+1}-${date.getMonth()}`);
      searchDate.push(`${previousMonthLastDay}-${date.getMonth()-1}`);
    }else{
      searchDate.push(`${date.getDate()}-${date.getMonth()}`);
      searchDate.push(`${date.getDate()+1}-${date.getMonth()}`);
      searchDate.push(`${date.getDate()-1}-${date.getMonth()}`);
    }
    return searchDate;
  }

  async loadNewsNotifications(event: any): Promise<void>{
    if(this.subscribedCopy.subsCriptions.length !== 0){
      await this.searchNotifications(this.subscribedCopy.subsCriptions);
      event.target.complete();
    }else{
      event.target.complete();
    }
    if(this.subscribedCopy.subsCriptions.length < 10){
      this.notLoadNotification = true;
    }
  }

  changeUrlSubscribed(notification: SendNotification): void{
    const subscribed: SubsCriptions = JSON.parse(this.storage.getItemStore('subscribed'));
    subscribed.subsCriptions.some((subscrition)=>{
      if(notification.uid === subscrition.uid){
        subscrition.url = notification.url;
        return true;
      }
    });
    this.storage.setItemStore('subscribed', JSON.stringify(subscribed));
    this.openAplication(notification.urlAuth, notification.url);
  }

  async openAplication(urlAuth: string, openUrl: string): Promise<void>{
    const { value } = await AppLauncher.canOpenUrl({
      url: `com.google.android.${urlAuth.split('-')[1]}`
    });
    if(value){
      await AppLauncher.openUrl({ url: openUrl });
    }else{
      alert(value);
    }
  }

  removePerIdUser(removeArray: Array<any>, idUser: string): void{
    if(removeArray.length !== 0){
      removeArray.some((positionActual, index)=>{
        if(positionActual.uid === idUser){
          removeArray.splice(index, 1);
          return true;
        }
      });
    }
  }
}
