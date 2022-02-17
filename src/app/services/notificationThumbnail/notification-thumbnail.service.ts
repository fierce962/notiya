import { Injectable } from '@angular/core';
import { SendNotification } from 'src/app/models/interface';
import { TwitchService } from '../twitch/twitch.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationThumbnailService {

  constructor(private twitchService: TwitchService) { }

  async start(): Promise<void>{
    await this.twitchService.hasToken();
  }

  set(notification: SendNotification): void{
    this[notification.urlAuth.split('-')[1]](notification);
  }

  private async twitch(notification: SendNotification): Promise<void>{
    const nameUrlPerfil: string = notification.url;
    notification.thumbnail = await this.twitchService.getPerfiles(nameUrlPerfil.split('/')[3]);
  }

  private youtube(notification: SendNotification): void{
    const urlId: RegExpMatchArray = notification.url.match('[\\?&]v=([^&#]*)');
    notification.thumbnail = `https://img.youtube.com/vi/${urlId[1]}/sddefault.jpg`;
  }

}
