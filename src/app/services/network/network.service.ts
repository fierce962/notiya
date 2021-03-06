import { Injectable } from '@angular/core';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  network: Subject<string> = new Subject();

  statusConection = true;

  desconecte = false;

  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }


  async getConectionStatus(): Promise<string>{
    return new Promise((resolve)=>{
      if(this.statusConection){
        this.desconecte = false;
        resolve('online');
      }else{
        this.network.subscribe(status=>{
          this.network.observers.pop();
          this.desconecte = false;
          resolve(status);
        });
      }
    });
  }

  initDetectConnection(): void{
    this.statusConection = navigator.onLine;
    this.detectConnection();
    this.detectDisconnection();
  }


  private detectConnection(): void{
    this.renderer.listen(window, 'online', ()=>{
      this.statusConection = true;
      this.network.next('online');
    });
  }

  private detectDisconnection(): void{
    this.renderer.listen(window, 'offline', ()=>{
      this.statusConection = false;
      this.desconecte = true;
      this.network.next('offline');
    });
  }
}
