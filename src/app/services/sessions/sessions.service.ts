import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { User, SendNotification, Subscription } from 'src/app/models/interface';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionsService {

  user: User;

  receivedNotification: SendNotification;

  authorizedUrl: string[] = ['youtube', 'twitch'];

  newSubscriptions: Subscription[] = [];

  removeSubscription$: Subject<string> = new Subject();

  sendNotification: Subject<boolean> = new Subject();

  viewLoadingSend = false;

  hasReceivedNotification = 0;

  private newSubsciptions$: Subject<Subscription[]> = new Subject();

  private receivedNotification$: Subject<SendNotification> = new Subject();


  constructor(private storage: StorageService) { }

  getUserLogin(): void{
    this.user = JSON.parse(this.storage.getItemStore('user'));
  }

  setNotification(notification: SendNotification): void{
    this.hasReceivedNotification++;
    this.receivedNotification$.next(notification);
  }

  getNotification(): Observable<SendNotification>{
    return this.receivedNotification$;
  }

  setNewSubscriptions(): void{
    if(this.newSubscriptions.length !== 0){
      this.newSubsciptions$.next(this.newSubscriptions);
    }
  }

  getNewSubscriptions(): Observable<Subscription[]>{
    return this.newSubsciptions$;
  }

  setremoveSubscription(userId: string): void{
    this.removeSubscription$.next(userId);
  }

  getRemoveSubscription(): Observable<string>{
    return this.removeSubscription$;
  }

  setSendNotification(valueSend: boolean): void{
    this.sendNotification.next(valueSend);
  }

  getSendNotification(): Observable<boolean>{
    return this.sendNotification;
  }
}
