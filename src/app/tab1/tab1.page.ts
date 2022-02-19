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

  constructor(private db: DatabaseService,
    private parserUsername: ParseUserNameService,
    private sessions: SessionsService,
    private historyBackbtn: HistoryBackButtonService) {}

  ngOnInit(): void {
    this.historyBackbtn.createListener().subscribe(()=>{
      console.log('tab1');
      this.historyBackbtn.backHistory(this);
    });
  }

  async search(event: KeyboardEvent): Promise<void>{
    console.log(this.searchbar);
    if(event.key === 'Enter'){
      this.viewSearch = false;
      const search: string = this.searchbar.nativeElement.querySelector('.searchbar-input').value;
      if(search !== ''){
        this.searchsUsers = await this.db.shearchUsers(this.parserUsername.get(search));
        if(this.searchsUsers.length !== 0){
          this.viewSearch = true;
          this.viewNotification = false;
          this.historyBackbtn.setHistory('viewSearch', false, 'none', 'boolean',
          {
            nameVar: 'viewNotification',
            valueInitial: true,
            typeVar: 'boolean',
            action: 'none'
          });
        }
      }
    }
  }

  focusInputSearch(): void{
    this.searchbar.nativeElement.setFocus();
    this.historyBackbtn.setHistory('viewInputSearch', false, 'none', 'boolean');
    this.historyBackbtn.setHistory('searchbar', '', 'setFocus', 'ElementRef');
  }

  setSubscriptions(): void{
    this.sessions.setNewSubscriptions();
  }
}
