/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable quote-props */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from '../storage/storage.service';
import { CreateTokenTwitch, PerfilesTwitch, SearchThumbnailTwitch } from 'src/app/models/interface';

@Injectable({
  providedIn: 'root'
})
export class TwitchService {

  private clientId = '792ksc171xi91q5fblqr5faz1ssyta';
  private secret = 'sq5wc9jzf5rojq9m3gixam2bsz83fr';

  constructor(private http: HttpClient, private storage: StorageService) { }

  async getPerfiles(search: SearchThumbnailTwitch){
    const httpOptions = {
      headers: new HttpHeaders({
        'Client-Id': this.clientId,
        'Authorization': `Bearer ${await this.hasToken()}`
      })
    };
    console.log(httpOptions);
    // return new Promise(resolve=>{
    //   this.http.get(`https://api.twitch.tv/helix/users?login=${search.perfilName}`, httpOptions)
    //   .subscribe((results: any)=>{
    //     resolve(results);
    //   });
    // });
  }

  private async hasToken(): Promise<string>{
    let token: string | null = this.storage.getItemStore('twitchToken');
    if(token === null){
      token = await this.createTokenTwitch();
      this.storage.setItemStore('twitchToken', token);
    }
    return token;
  }

  private async createTokenTwitch(): Promise<string>{
    console.log('create token');
    return new Promise((resolve)=>{
      // eslint-disable-next-line max-len
      this.http.post(`https://id.twitch.tv/oauth2/token?client_id=792ksc171xi91q5fblqr5faz1ssyta&client_secret=sq5wc9jzf5rojq9m3gixam2bsz83fr&grant_type=client_credentials&scope=user_read`, {})
      .subscribe((res: any)=>{
        const result: CreateTokenTwitch = res;
        resolve(result.access_token);
      });
    });
  }
}
