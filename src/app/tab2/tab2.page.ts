import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OneSignalService } from '../services/OneSignal/one-signal.service';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  notificaion = new FormGroup({
    titulo: new FormControl('', [Validators.required]),
    mensaje: new FormControl('', [Validators.required]),
    url: new FormControl('', [Validators.required])
  });

  constructor(private oneSignal: OneSignalService) {}

  sendNotification(): void{
    if(this.notificaion.valid){
      this.oneSignal.send(this.notificaion.controls.titulo.value,
        this.notificaion.controls.mensaje.value,
        this.notificaion.controls.url.value);
    }else{
      this.viewInputError();
    }
  }

  viewInputError(): void{
    Object.keys(this.notificaion.controls).forEach(input=>{
      if(!this.notificaion.controls[input].valid){
        this.notificaion.controls[input].setErrors({error: 'error'});
      }
    });
  }
}
