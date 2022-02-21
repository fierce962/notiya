import { Component, OnInit } from '@angular/core';
import { SessionsService } from './services/sessions/sessions.service';
import { NavigationEnd, Router } from '@angular/router';
import { OneSignalService } from './services/OneSignal/one-signal.service';
import { ControlHistoryRoutService } from './services/ControlHistoryRout/control-history-rout.service';
import { App } from '@capacitor/app';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private sessions: SessionsService,
    private router: Router,
    private oneSignal: OneSignalService,
    private controlHistory: ControlHistoryRoutService) {}

  ngOnInit(): void {
    this.sessions.getUserLogin();
    this.oneSignal.oneSignalInit(this.sessions);
    this.redirect();

    this.router.events.subscribe(events=>{
      if(events instanceof NavigationEnd){
        this.controlHistory.setUrlVisited(events.url);
      }
    });

    this.controlHistory.getpreviousUrl().subscribe(url=>{
      if(url !== 'close'){
        this.router.navigate([url]);
      }else{
        App.exitApp();
      }
    });
  }

  redirect(): void{
    if(this.sessions.user === null){
      this.router.navigate(['login']);
    }
  }

}
