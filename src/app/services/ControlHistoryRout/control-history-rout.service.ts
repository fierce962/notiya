import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ControlHistoryRoutService {

  private previousUrl: Subject<string> = new Subject();

  private visitedUrl: string[] = [];

  constructor() { }

  setUrlVisited(currentUrl: string): void{
    if(currentUrl !== '/login' && currentUrl !== '/register'){
      const currentPosition = this.visitedUrl.indexOf(currentUrl);
      if(currentPosition !== -1){
        this.visitedUrl.splice(currentPosition, 1);
      }
      if(currentUrl === '/'){
        currentUrl = '/tabs/tab1';
      };
      this.visitedUrl.push(currentUrl);
    };
    console.log(this.visitedUrl);
  }

  removeUrl(): void{
    console.log('function  remove');
    console.log('visited', this.visitedUrl);
    if(this.visitedUrl.length !== 0){
      const previousUrl = this.visitedUrl.shift();
      console.log('previous', previousUrl);
      this.setpreviousUrl(previousUrl);
    }else{
      this.setpreviousUrl('close');
    }
  }

  getpreviousUrl(): Observable<string>{
    return this.previousUrl;
  }

  private setpreviousUrl(url: string): void{
    this.previousUrl.next(url);
  }
}
