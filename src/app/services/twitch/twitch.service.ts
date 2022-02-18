/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable quote-props */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from '../storage/storage.service';
import { CreateTokenTwitch, PerfilesTwitch, InvalidTokenTwitch } from 'src/app/models/interface';

@Injectable({
  providedIn: 'root'
})
export class TwitchService {

  private clientId = '792ksc171xi91q5fblqr5faz1ssyta';
  private secret = 'sq5wc9jzf5rojq9m3gixam2bsz83fr';

  constructor(private http: HttpClient, private storage: StorageService) { }

  async getPerfiles(nameSearch: string): Promise<string>{
    const token = this.storage.getItemStore('twitchToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Client-Id': this.clientId,
        'Authorization': `Bearer ${token}`
      })
    };
    return new Promise(resolve=>{
      this.http.get(`https://api.twitch.tv/helix/users?login=${nameSearch}`, httpOptions)
      .subscribe((results: any)=>{
        const perfiles: PerfilesTwitch = results;
        resolve(perfiles.data[0].profile_image_url);
      });
    });
  }

  async hasToken(): Promise<string>{
    let token: string | null = this.storage.getItemStore('twitchToken');
    const valid: boolean = await this.validToken(token);
    if(token === null || valid){
      const createToken = await this.createTokenTwitch();
      token = createToken.access_token;
      this.storage.setItemStore('twitchToken', token);
    }
    return token;
  }

  private async createTokenTwitch(): Promise<CreateTokenTwitch>{
      // eslint-disable-next-line max-len
      const token = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${this.clientId}&client_secret=${this.secret}&grant_type=client_credentials&scope=user_read`, {
        method: 'POST',
        body: '{}'
      });
      return token.json();
  }

  private async validToken(token: string): Promise<boolean>{
    if(token !== null){
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      };
      return new Promise((resolve)=>{
        this.http.get('https://id.twitch.tv/oauth2/validate', httpOptions)
        .subscribe(res=>{
          resolve(false);
        }, (err)=>{
          const errorMensage: InvalidTokenTwitch = err;
          if(errorMensage.error.message === 'invalid access token'){
            resolve(true);
          }
        });
      });
    }
    return false;
  }
}
