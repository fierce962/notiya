import { Injectable } from '@angular/core';
import { SendNotification, SearchThumbnailTwitch } from 'src/app/models/interface';
import { TwitchService } from '../twitch/twitch.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationThumbnailService {

  searchTwitchThumbnail: SearchThumbnailTwitch = {
    perfilName: '',
    notification: []
  };

  constructor(private twitchService: TwitchService) { }

  set(notification: SendNotification): void{
    this[notification.urlAuth.split('-')[1]](notification);
  }

  async endProcess(){
    const test = await this.twitchService.getPerfiles(this.searchTwitchThumbnail);
    console.log(test);
  }

  private twitch(notification: SendNotification): void{
    if(this.searchTwitchThumbnail.perfilName !== ''){
      this.searchTwitchThumbnail.perfilName = `${this.searchTwitchThumbnail.perfilName},${notification.url.split('/')[3]}`;
    }else{
      this.searchTwitchThumbnail.perfilName = `${notification.url.split('/')[3]}`;
    }
    this.searchTwitchThumbnail.notification.push(notification);
  }

  private youtube(notification: SendNotification): void{
    const urlId: RegExpMatchArray = notification.url.match('[\\?&]v=([^&#]*)');
    notification.thumbnail = `https://img.youtube.com/vi/${urlId[1]}/sddefault.jpg`;
  }

}
