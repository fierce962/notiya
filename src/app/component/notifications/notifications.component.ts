import { Component, NgZone, OnInit } from '@angular/core';
import { SessionsService } from '../../services/sessions/sessions.service';
import { SendNotification, SubsCriptions, Subscription } from '../../models/interface';
import { AppLauncher } from '@capacitor/app-launcher';
import { StorageService } from 'src/app/services/storage/storage.service';
import { DatabaseService } from 'src/app/services/dataBase/database.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {

  openNotification = true;
  notification: SendNotification[] = [];
  subscribedCopy: SubsCriptions;

  constructor(private sessions: SessionsService, private database: DatabaseService,
    private ng: NgZone, private storage: StorageService) { }

  ngOnInit() {
    this.startApp();
    this.sessions.getNotification().subscribe(notification=>{
      this.ng.run(()=>{
        this.notification.push(notification);
        this.openNotification = true;
      });
    });
  }

  async startApp(): Promise<void>{
    this.subscribedCopy = JSON.parse(this.storage.getItemStore('subscribed'));
    if(this.sessions.receivedNotification === undefined){
      this.searchNotifications([... this.subscribedCopy.subsCriptions]);
    }else{
      this.notification.push(this.sessions.receivedNotification);
      this.openNotification = true;
    }
  }

  async searchNotifications(subscritions: Subscription[]): Promise<void>{
    if(subscritions.length !== 0){
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
      this.setNotification(notifications, invalidUrl);
      this.changePositionSubscriptions(numberChange);
      if(this.notification.length < 10){
        this.searchNotifications(this.subscribedCopy.subsCriptions);
      }
    }
  }

  setNotification(notifications, invalidUrl: object): void{
    const dateValid: string[] = this.getSearchDay();
    notifications.forEach((notification: any) => {
      const newNotification: SendNotification = notification.data();
      if(invalidUrl[newNotification.uid] !== newNotification.url){
        dateValid.forEach(day=>{
          if(day === newNotification.date){
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
      searchDate.push(`${date.getDate()-1}-${date.getMonth()+1}`);
    }
    return searchDate;
  }
}
