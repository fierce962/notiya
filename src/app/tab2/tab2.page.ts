import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OneSignalService } from '../services/OneSignal/one-signal.service';
import { DatabaseService } from '../services/dataBase/database.service';
import { SessionsService } from '../services/sessions/sessions.service';
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

  constructor(private oneSignal: OneSignalService,
    private db: DatabaseService,
    private sessions: SessionsService) {}

  async sendNotification(): Promise<void>{
    if(this.notificaion.valid){
      const tokens: string[] = await this.db.getListenerNotification(this.sessions.user.uid);
      this.oneSignal.send(this.notificaion.controls.titulo.value,
        this.notificaion.controls.mensaje.value,
        this.notificaion.controls.url.value,
        tokens);
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
