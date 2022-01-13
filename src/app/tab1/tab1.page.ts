import { Component, OnInit } from '@angular/core';
import { NotificationPushService } from '../services/notificationPush/notification-push.service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  constructor(private notification: NotificationPushService) {}

  ngOnInit(): void {
    this.notification.registerDevice();
  }

}
