import { Component, OnInit } from '@angular/core';
import { NotificationPushService } from '../services/notificationPush/notification-push.service';
import { DatabaseService } from '../services/dataBase/database.service';
import { ParseUserNameService } from '../services/parseUserName/parse-user-name.service';
import { UserData } from '../models/interface';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  inputValue: string[] = [];

  input = new FormControl('');

  clearView = false;

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
      const search: string = this.inputValue.join('');
      if(search !== ''){
        this.searchsUsers = await this.db.shearchUsers(this.parserUsername.get(search));
        if(this.searchsUsers.length !== 0){
          this.viewSearch = true;
        }
      }
    }else{
      this.createValueInput(event);
    }
  }

  createValueInput(event: KeyboardEvent): void{
    if(event.key !== 'Backspace'){
      this.inputValue.push(event.key);
    }else{
      this.inputValue.pop();
    }
    this.setclearView();
  }

  setclearView(): void{
    if(this.inputValue.length === 0){
      this.clearView = false;
    }else{
      this.clearView = true;
    }
  }

  clearInput(): void{
    this.input.setValue('');
    this.clearView = false;
    this.inputValue = [];
  }
}
