import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { User, SendNotification } from 'src/app/models/interface';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionsService {

  user: User;

  receivedNotification: SendNotification;

  private receivedNotification$: Subject<SendNotification> = new Subject();

  constructor(private storage: StorageService) { }

  getUserLogin(): void{
    this.user = JSON.parse(this.storage.getItemStore('user'));
  }

  setNotification(notification: SendNotification): void{
    this.receivedNotification$.next(notification);
  }

  getNotification(): Observable<SendNotification>{
    return this.receivedNotification$;
  }
}
