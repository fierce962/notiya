import { Component, OnInit } from '@angular/core';
import { SessionsService } from 'src/app/services/sessions/sessions.service';
@Component({
  selector: 'app-loading-send-notification',
  templateUrl: './loading-send-notification.component.html',
  styleUrls: ['./loading-send-notification.component.scss'],
})
export class LoadingSendNotificationComponent implements OnInit {

  send = false;
  error = false;

  constructor(private sessions: SessionsService) { }

  ngOnInit() {
    this.setlistenerNotificationSend();
  }

  setlistenerNotificationSend(): void{
    setTimeout(() => {
      this.send = true;
      //this.errorSend();
      // this.sessions.getSendNotification().subscribe(send=>{
      //   if(send){
      //   }else{
      //   }
      // });
    }, 2000);
  }

  errorSend(): void{
    this.error = true;
  }
}
