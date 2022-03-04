import { Component, OnInit } from '@angular/core';
import { SessionsService } from 'src/app/services/sessions/sessions.service';
import { NetworkService } from 'src/app/services/network/network.service';
@Component({
  selector: 'app-loading-send-notification',
  templateUrl: './loading-send-notification.component.html',
  styleUrls: ['./loading-send-notification.component.scss'],
})
export class LoadingSendNotificationComponent implements OnInit {

  send = false;
  error = false;
  offline = true;

  constructor(private sessions: SessionsService, private network: NetworkService) { }

  ngOnInit() {
    this.setlistenerNotificationSend();
    this.getStatusConection();
  }

  setlistenerNotificationSend(): void{
    setTimeout(() => {
      this.sessions.getSendNotification().subscribe(send=>{
        if(send){
          this.send = true;
        }else{
          this.error = true;
        };
      });
    }, 2000);
  };

  getStatusConection(): void{
    this.network.network.subscribe(status=>{
      if(status === 'offline'){
        this.offline = true;
      }else{
        this.offline = false;
      }
    });
  }
}
