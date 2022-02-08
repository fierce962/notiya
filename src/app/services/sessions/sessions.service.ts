import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { User, ReceivedNotification } from 'src/app/models/interface';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionsService {

  user: User;

  receivedNotification: ReceivedNotification;

  private receivedNotification$: Subject<ReceivedNotification> = new Subject();

  constructor(private storage: StorageService) { }

  getUserLogin(): void{
    this.user = JSON.parse(this.storage.getItemStore('user'));
  }

  setNotification(notification: ReceivedNotification): void{
    this.receivedNotification$.next(notification);
  }

  getNotification(): Observable<ReceivedNotification>{
    return this.receivedNotification$;
  }
}
