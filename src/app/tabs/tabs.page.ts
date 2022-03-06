import { Component } from '@angular/core';
import { SessionsService } from '../services/sessions/sessions.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private sessions: SessionsService) {}

}
