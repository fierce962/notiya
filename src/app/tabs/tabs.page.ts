import { Component, OnInit } from '@angular/core';
import { SessionsService } from '../services/sessions/sessions.service';
import { NavigationEnd, Router } from '@angular/router';
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  viewTabs = true;

  constructor(public sessions: SessionsService, private router: Router) {}

  ngOnInit(): void {
    this.setViewTabs();
  }

  setViewTabs(): void{
    this.router.events.subscribe(events=>{
      if(events instanceof NavigationEnd){
        if(events.url === '/tabs/login' || events.url === '/tabs/register'){
          this.viewTabs = false;
        }else{
          this.viewTabs = true;
        }
      }
    });
  }
}
