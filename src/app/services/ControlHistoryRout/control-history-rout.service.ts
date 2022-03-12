import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ControlHistoryRoutService {

  private previousUrl: Subject<string> = new Subject();

  private mainUrl = '';

  private close = false;

  constructor() { }

  setMainUrl(currentUrl: string): void{
    this.close = false;
    if(currentUrl === '/login'){
      this.mainUrl = '/login';
    }else if(currentUrl === '/' || currentUrl === '/tabs/tab1'){
      currentUrl = '/tabs/tab1';
      this.mainUrl = '/tabs/tab1';
    };
    if(this.mainUrl === currentUrl){
      this.close = true;
    };
  }

  changeUrlwithMain(): void{
    let urlChange: string = this.mainUrl;
    if(this.close){
      urlChange = 'close';
    }
    this.changeUrlMain(urlChange);
  }

  getMainUrl(): Observable<string>{
    return this.previousUrl;
  }

  private changeUrlMain(url: string): void{
    this.previousUrl.next(url);
  }
}
