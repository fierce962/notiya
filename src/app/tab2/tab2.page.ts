/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  private httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin':'*'
    })
  };

  constructor(private http: HttpClient) {}

  sendNotification(): void{
    this.http.post('https://onesignal.com/api/v1/notifications', {
      "app_id": 'e1d6c6f3-0f5c-4a20-a688-75319373f280',
      "include_player_ids": ['1166b790-8617-11ec-9c8f-aecd5c7aa51b'],
      "data": {"foo": "bar"}
      }, this.httpOptions).subscribe(res=>{
        console.log(res);
      });
  }
}
