import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from '../services/dataBase/database.service';
import { ParseUserNameService } from '../services/parseUserName/parse-user-name.service';
import { UserData } from '../models/interface';
import { SessionsService } from '../services/sessions/sessions.service';
import { HistoryBackButtonService } from '../services/historyBackButton/history-back-button.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  @ViewChild('searchbar', { read: ElementRef }) searchbar: ElementRef;

  searchsUsers: UserData[];
  viewSearch = false;
  viewNotification = true;
  viewInputSearch = false;
  currentUrl = '/tabs/tab1';

  constructor(private db: DatabaseService,
    private parserUsername: ParseUserNameService,
    private sessions: SessionsService,
    private historyBackbtn: HistoryBackButtonService) {}

  ngOnInit(): void {
    this.historyBackbtn.getListener().subscribe(() =>{
      this.historyBackbtn.test(this.currentUrl, this);
    });
  }

  async search(event: KeyboardEvent): Promise<void>{
    if(event.key === 'Enter'){
      this.viewSearch = false;
      const search: string = this.searchbar.nativeElement.querySelector('.searchbar-input').value;
      if(search !== ''){
        this.searchsUsers = await this.db.shearchUsers(this.parserUsername.get(search));
        if(this.searchsUsers.length !== 0){
          this.viewSearch = true;
          this.viewNotification = false;
          this.historyBackbtn.setHistory(this.currentUrl,'viewSearch', false, 'none',
          {
            nameVar: 'viewNotification',
            valueInitial: true,
            action: 'none'
          });
        }
      }
    }
  }

  focusInputSearch(): void{
    this.historyBackbtn.setHistory(this.currentUrl, 'viewInputSearch', false, 'none');
    this.historyBackbtn.setHistory(this.currentUrl, 'searchbar', false, 'setFocus');
  }

  setSubscriptions(): void{
    this.sessions.setNewSubscriptions();
  }
}
