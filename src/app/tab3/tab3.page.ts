import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage/storage.service';
import { OneSignalService } from '../services/OneSignal/one-signal.service';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { BackBtnHistory } from '../models/BackBtnHistory';
import { ControlHistoryRoutService } from '../services/ControlHistoryRout/control-history-rout.service';
import { AuthServiceService } from '../services/authService/auth-service.service';
import { SessionsService } from '../services/sessions/sessions.service';
import { DatabaseService } from '../services/dataBase/database.service';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  history = new BackBtnHistory(this, this.controlHistory);

  componentUrl: string;

  optionSelect = false;

  options = false;
  optionsName: string;

  notificationView = true;

  isModalOpen = false;

  numberSubscription: number;

  constructor(private storage: StorageService, private router: Router,
    private oneSignal: OneSignalService, private platform: Platform,
    private controlHistory: ControlHistoryRoutService,
    private auth: AuthServiceService, public sessions: SessionsService,
    private db: DatabaseService) {}

  ngOnInit(): void {
    this.componentUrl = this.router.url;
    this.platform.backButton.subscribe(()=>{
      if(this.router.url === this.componentUrl){
        this.history.backHistory();
      };
    });
    this.sessions.getCloseModalImg().subscribe(close=>{
      this.ionModalDidDismiss(close);
    });
  }

  async ionViewWillEnter(): Promise<void>{
    this.hasImg();
    this.numberSubscription = await this.db.getNumberSubscription(this.sessions.user);
  }

  hasImg(): void{
    const img = JSON.parse(this.storage.getItemStore('profileImg'));
    if(img !== null){
      this.sessions.imgProfile = img;
    }else{
      this.sessions.imgProfile = './assets/icon/no-image.png';
    }
    if(this.notificationView === false){
      this.notificationView = true;
    }
  }

  signOut(): void{
    this.storage.clearStore();
    this.oneSignal.removeExternalid();
    this.auth.logout();
    this.sessions.closeReloadNotification = true;
    this.notificationView = false;
    this.router.navigate(['login']);
  }

  changeOptions(optionName: string): void{
    this.optionsName = optionName;
    this.options = true;
  }

  closeOptions(close: boolean): void{
    this.optionsName = undefined;
    this.options = !close;
  }

  ionModalDidDismiss(value: boolean): void{
    this.isModalOpen = value;
  }
}
