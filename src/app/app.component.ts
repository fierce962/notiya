import { Component, OnInit } from '@angular/core';
import { SessionsService } from './services/sessions/sessions.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private sessions: SessionsService, private router: Router) {}

  ngOnInit(): void {
    this.sessions.getUserLogin();
    this.redirect();
  }

  redirect(): void{
    if(this.sessions.user === null){
      this.router.navigate(['login']);
    }
  }

}
