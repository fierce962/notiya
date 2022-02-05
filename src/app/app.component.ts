import { Component, OnInit } from '@angular/core';
import { SessionsService } from './services/sessions/sessions.service';
import { Router } from '@angular/router';
import { OneSignalService } from './services/OneSignal/one-signal.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private sessions: SessionsService,
    private router: Router,
    private oneSignal: OneSignalService) {}

  ngOnInit(): void {
    this.sessions.getUserLogin();
    this.redirect();
    this.oneSignal.oneSignalInit();
  }

  redirect(): void{
    if(this.sessions.user === null){
      this.router.navigate(['login']);
    }
  }

}
