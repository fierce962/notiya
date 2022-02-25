import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage/storage.service';
import { OneSignalService } from '../services/OneSignal/one-signal.service';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { BackBtnHistory } from '../models/BackBtnHistory';
import { ControlHistoryRoutService } from '../services/ControlHistoryRout/control-history-rout.service';
import { AuthServiceService } from '../services/authService/auth-service.service';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  history = new BackBtnHistory(this, this.controlHistory);

  componentUrl: string;

  constructor(private storage: StorageService, private router: Router,
    private oneSignal: OneSignalService, private platform: Platform,
    private controlHistory: ControlHistoryRoutService,
    private auth: AuthServiceService) {}

  ngOnInit(): void {
    this.componentUrl = this.router.url;
    this.platform.backButton.subscribe(()=>{
      if(this.router.url === this.componentUrl){
        this.history.backHistory();
      };
    });
  }

  signOut(): void{
    this.storage.clearStore();
    this.oneSignal.removeExternalid();
    this.auth.logout();
    this.router.navigate(['login']);
  }
}
