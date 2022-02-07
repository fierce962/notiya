/* eslint-disable @typescript-eslint/member-ordering */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from '../services/dataBase/database.service';
import { ParseUserNameService } from '../services/parseUserName/parse-user-name.service';
import { UserData } from '../models/interface';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  @ViewChild('searchbar', { read: ElementRef }) searchbar: ElementRef;

  searchsUsers: UserData[];
  viewSearch = false;
  viewInputSearch = false;

  constructor(private db: DatabaseService,
    private parserUsername: ParseUserNameService) {}

  ngOnInit(): void {}

  async search(event: KeyboardEvent): Promise<void>{
    if(event.key === 'Enter'){
      const search: string = this.searchbar.nativeElement.querySelector('.searchbar-input').value;
      if(search !== ''){
        this.searchsUsers = await this.db.shearchUsers(this.parserUsername.get(search));
        if(this.searchsUsers.length !== 0){
          this.viewSearch = true;
        }
      }
    }
  }
}
