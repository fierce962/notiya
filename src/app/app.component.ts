import { Component, NgZone, OnInit } from '@angular/core';
import { SessionsService } from './services/sessions/sessions.service';
import { NavigationEnd, Router } from '@angular/router';
import { OneSignalService } from './services/OneSignal/one-signal.service';
import { ControlHistoryRoutService } from './services/ControlHistoryRout/control-history-rout.service';
import { App } from '@capacitor/app';
import { AuthServiceService } from './services/authService/auth-service.service';
import { NetworkService } from './services/network/network.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  close = true;

  errorNetWork: boolean;

  constructor(private sessions: SessionsService,
    private router: Router,
    private oneSignal: OneSignalService,
    private controlHistory: ControlHistoryRoutService,
    private zone: NgZone,
    private auth: AuthServiceService,
    private network: NetworkService) {}

  ngOnInit(): void {
    this.network.initDetectConnection();
    this.viewError();
    this.errorNetWork = !this.network.statusConection;
    this.sessions.getUserLogin();
    this.oneSignal.oneSignalInit(this.sessions);
    this.redirect();

    this.router.events.subscribe(events=>{
      if(events instanceof NavigationEnd){
        this.controlHistory.setMainUrl(events.url);
      }
    });

    this.auth.checkToken();

    this.controlHistory.getMainUrl().subscribe(url=>{
      this.zone.run(()=>{
        if(url !== 'close'){
          this.router.navigate([url]);
        }else{
          App.exitApp();
        }
      });
    });
  }

  redirect(): void{
    if(this.sessions.user === null){
      this.router.navigate(['/tabs/login']);
    }
  }

  viewError(): void{
    this.network.network.subscribe((status)=>{
      this.zone.run(()=>{
        if(status === 'offline'){
          this.errorNetWork = true;
        }else{
          this.errorNetWork = false;
        }
      });
    });
  }

}
