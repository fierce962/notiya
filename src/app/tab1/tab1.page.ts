import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from '../services/dataBase/database.service';
import { ParseUserNameService } from '../services/parseUserName/parse-user-name.service';
import { UserData } from '../models/interface';
import { SessionsService } from '../services/sessions/sessions.service';
import { Router } from '@angular/router';
import { BackBtnHistory } from '../models/BackBtnHistory';
import { Platform } from '@ionic/angular';
import { ControlHistoryRoutService } from '../services/ControlHistoryRout/control-history-rout.service';


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
  history = new BackBtnHistory(this, this.controlHistory);
  componentUrl: string;

  viewSearchLoad = false;
  viewSearchComplete = false;

  constructor(private db: DatabaseService,
    private parserUsername: ParseUserNameService,
    private sessions: SessionsService,
    private router: Router,
    private platform: Platform,
    private controlHistory: ControlHistoryRoutService) {}

  ngOnInit(): void {
    this.componentUrl = this.router.url;
    this.platform.backButton.subscribe(()=>{
      if(this.router.url === this.componentUrl){
        this.history.backHistory();
      };
    });
  }

  ionViewWillEnter(): void{
    if(this.sessions.closeReloadNotification === true){
      this.sessions.closeReloadNotification = false;
    }
  }

  async search(event: KeyboardEvent): Promise<void>{
    if(event.key === 'Enter'){
      this.viewSearch = false;
      const search: string = this.searchbar.nativeElement.querySelector('.searchbar-input').value;
      if(search !== ''){
        this.viewSearchLoad = true;
        this.searchsUsers = await this.db.shearchUsers(this.parserUsername.get(search));
        this.viewLoadComplete();
        this.viewSearch = true;
        this.viewNotification = false;
        this.history.setColention({
          nameHistory: 'search',
          nameVar: 'viewNotification',
          initialValue: true,
          type: 'primitive'
        });
        this.history.setColention({
          nameHistory: 'search',
          nameVar: 'viewSearch',
          initialValue: false,
          type: 'primitive'
        });
      }
    }
  }

  viewLoadComplete(): void{
    this.viewSearchComplete = true;
    setTimeout(() => {
      this.viewSearchLoad = false;
      this.viewSearchComplete = false;
    }, 500);
  }

  focusInputSearch(): void{
    this.searchbar.nativeElement.setFocus();
    this.history.setColention({
      nameHistory: 'search',
      nameVar: 'viewInputSearch',
      initialValue: false,
      type: 'primitive'
    });
    this.history.setColention({
      nameHistory: 'search',
      nameVar: 'searchbar',
      initialValue: '',
      type: 'ViewChild'
    });
  }

  setSubscriptions(): void{
    this.sessions.setNewSubscriptions();
  }
}
