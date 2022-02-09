import { Component, NgZone, OnInit } from '@angular/core';
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

  constructor(private sessions: SessionsService, private ng: NgZone) { }

  ngOnInit() {
    this.startApp();
    this.sessions.getNotification().subscribe(notification=>{
      this.ng.run(()=>{
        this.notification.push(notification);
        this.openNotification = true;
      });
    });
  }

  startApp(): void{
    if(this.sessions.receivedNotification === undefined){
      const notificication: SendNotification = {
        title: 'test',
        message: 'mensaje',
        url: 'https://www.youtube.com/watch?v=ItL6vcUrpUs&list=RDItL6vcUrpUs&start_radio=1&ab_channel=MacklemoreLLC',
        userName: 'mariana',
        urlAuth: 'logo-youtube'
      };
      this.notification.push(notificication);
    }else{
      this.notification.push(this.sessions.receivedNotification);
      this.openNotification = true;
    }
  }

  async openAplication(urlAuth: string, openUrl: string): Promise<void>{
    const { value } = await AppLauncher.canOpenUrl({
      url: `com.google.android.${urlAuth.split('-')[1]}`
    });
    if(value){
      await AppLauncher.openUrl({ url: openUrl });
    }else{
      alert(value);
    }
  }

}
