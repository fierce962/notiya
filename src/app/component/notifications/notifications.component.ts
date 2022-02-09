import { Component, NgZone, OnInit, ChangeDetectorRef } from '@angular/core';
import { SessionsService } from '../../services/sessions/sessions.service';
import { SendNotification } from '../../models/interface';
import { AppLauncher } from '@capacitor/app-launcher';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {

  openNotification = true;
  notification: SendNotification[] = [];

  constructor(private sessions: SessionsService, private ng: NgZone, private change: ChangeDetectorRef) { }

  ngOnInit() {
    this.startApp();
    this.sessions.getNotification().subscribe(notification=>{
      this.ng.run(()=>{
        this.notification.push(notification);
        this.openNotification = true;
        console.log(this.notification);
        this.change.markForCheck();
      });
    });
  }

  startApp(): void{
    if(this.sessions.receivedNotification === undefined){
      const notificication: SendNotification = {
        title: 'test',
        message: 'mensaje',
        url: 'https://www.youtube.com/watch?v=D8pwbMbW7RY&ab_channel=DobleG',
        userName: 'mariana',
        urlAuth: 'logo-youtube'
      };
      this.notification.push(notificication);
    }else{
      //this.notification.push(new OpenAplications(this.sessions.receivedNotification));
      this.openNotification = true;
    }
  }

  openAplication(): void{
    // const { value } = await AppLauncher.canOpenUrl({ url: `com.google.android.${checkUrl}` });
    // if(value){
    //     await AppLauncher.openUrl({ url: urlAplication });
    // }else{
    //     alert(value);
    // }
  }

}
