import { Injectable } from '@angular/core';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private statusConection = true;

  private network: Subject<string> = new Subject();
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }


  async getConectionStatus(): Promise<string>{
    console.log('detectando estatus', this.statusConection);
    return new Promise((resolve)=>{
      if(this.statusConection){
        console.log('true');
        resolve('online');
      }else{
        this.network.subscribe(status=>{
          console.log('termino estatus');
          resolve(status);
        });
      }
    });
  }

  initDetectConnection(): void{
    this.statusConection = navigator.onLine;
    console.log(this.statusConection);
    this.detectConnection();
    this.detectDisconnection();
  }


  private detectConnection(): void{
    this.renderer.listen(window, 'online', ()=>{
      console.log('online');
      this.statusConection = true;
      this.network.next('online');
    });
  }

  private detectDisconnection(): void{
    this.renderer.listen(window, 'offline', ()=>{
      console.log('offline');
      this.statusConection = false;
    });
  }
}
