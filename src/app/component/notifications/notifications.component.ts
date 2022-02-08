import { Component, NgZone, OnInit } from '@angular/core';
import { SessionsService } from '../../services/sessions/sessions.service';

import { ReceivedNotification } from '../../models/interface';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {

  openNotification = false;
  notification: ReceivedNotification;

  constructor(private sessions: SessionsService, private ng: NgZone) { }

  ngOnInit() {
    this.startApp();
    this.sessions.getNotification().subscribe(notification=>{
      this.ng.run(()=>{
        this.notification = notification;
        this.openNotification = true;
      });
    });
  }

  startApp(): void{
    if(this.sessions.receivedNotification === undefined){

    }else{
      this.notification = this.sessions.receivedNotification;
      this.openNotification = true;
    }
  }

}
