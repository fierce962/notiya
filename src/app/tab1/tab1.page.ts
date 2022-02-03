import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NotificationPushService } from '../services/notificationPush/notification-push.service';
import { DatabaseService } from '../services/dataBase/database.service';
import { ParseUserNameService } from '../services/parseUserName/parse-user-name.service';
import { UserData } from '../models/interface';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  searchInput = new FormControl();
  searchsUsers: UserData[];
  viewSearch = false;
  viewInputSearch = false;

  constructor(private notification: NotificationPushService,
    private db: DatabaseService,
    private parserUsername: ParseUserNameService) {}

  ngOnInit(): void {
    //this.notification.registerDevice();
  }

  async search(event: KeyboardEvent): Promise<void>{
    if(event.key === 'Enter'){
      console.log(event);
      this.searchsUsers = await this.db.shearchUsers(this.parserUsername.get(this.searchInput.value));
      if(this.searchsUsers.length !== 0){
        this.viewSearch = true;
      }
    }
  }
}
