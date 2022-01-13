import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  getItemStore(key: string): string{
    return localStorage.getItem(key);
  }

  setItemStore(key: string, value: string): void{
    localStorage.setItem(key, value);
  }

  clearStore(): void{
    localStorage.clear();
  }

  saveNotification(key: string, newNotification: string): void{
    console.log(newNotification);
    const notification = this.getItemStore(key);
    let notificationParse: string;
    if(notification === null){
      notificationParse = this.parseStoreToString([newNotification]);
    }else {
      const previousNotifications = this.parseStoreToObject(notification);
      previousNotifications.unshift(this.parseStoreToObject(newNotification));
      notificationParse = this.parseStoreToString(previousNotifications);
    };
    this.setItemStore(key, notificationParse);
  }

  private parseStoreToString(notification: string[] | object[]): string{
    return JSON.stringify(notification);
  }

  private parseStoreToObject(value: string): object[]{
    return JSON.parse(value);
  }
}
