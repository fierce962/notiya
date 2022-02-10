import { Component } from '@angular/core';
import { StorageService } from '../services/storage/storage.service';
import { OneSignalService } from '../services/OneSignal/one-signal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(private storage: StorageService, private router: Router,
    private oneSignal: OneSignalService) {}

  signOut(): void{
    this.storage.clearStore();
    this.oneSignal.removeExternalid();
    this.router.navigate(['login']);
  }
}
