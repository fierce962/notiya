import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NotificationPushService } from '../services/notificationPush/notification-push.service';
import { DatabaseService } from '../services/dataBase/database.service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  searchInput = new FormControl();

  constructor(private notification: NotificationPushService, private db: DatabaseService) {}

  ngOnInit(): void {
    //this.notification.registerDevice();
    const test = 'fiercess ';
    const init = test.length / 2;
    const initPalabra = test.slice(0, init);
    const end = test.slice(init);
  }

  search(event: KeyboardEvent): void{
    if(event.key === 'Enter'){

      // this.db.shearchUsers(text, startText, endText);
    }
  }
}
