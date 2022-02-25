import { Component, NgZone, OnInit } from '@angular/core';
import { SessionsService } from './services/sessions/sessions.service';
import { NavigationEnd, Router } from '@angular/router';
import { OneSignalService } from './services/OneSignal/one-signal.service';
import { ControlHistoryRoutService } from './services/ControlHistoryRout/control-history-rout.service';
import { App } from '@capacitor/app';
import { AuthServiceService } from './services/authService/auth-service.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private sessions: SessionsService,
    private router: Router,
    private oneSignal: OneSignalService,
    private controlHistory: ControlHistoryRoutService,
    private zone: NgZone,
    private auth: AuthServiceService) {}

  ngOnInit(): void {
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
        console.log('appcomponent ', url);
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
      this.router.navigate(['login']);
    }
  }

}
