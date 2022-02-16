import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OneSignalService } from '../services/OneSignal/one-signal.service';
import { DatabaseService } from '../services/dataBase/database.service';
import { SessionsService } from '../services/sessions/sessions.service';
import { StorageService } from '../services/storage/storage.service';
import { SendNotification } from 'src/app/models/interface';
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
    private sessions: SessionsService,
    private storage: StorageService) {}

  async sendNotification(): Promise<void>{
    if(this.notificaion.valid){
      const sendNotification: SendNotification = this.createNotification();
      const tokens: string[] = await this.db.getListenerNotification(this.sessions.user.uid);
      this.oneSignal.send(sendNotification, tokens);
      this.registerLastNotification(sendNotification);
    }else{
      this.viewInputError();
    }
  }

  createNotification(): SendNotification{
    const sendNotification: SendNotification = {
      uid: this.sessions.user.uid,
      title: this.notificaion.controls.titulo.value,
      message: this.notificaion.controls.mensaje.value,
      url: this.notificaion.controls.url.value,
      userName: this.sessions.user.displayName,
      urlAuth: this.checkUrl(this.notificaion.controls.url.value),
      date: this.createDate()
    };
    return sendNotification;
  }

  createDate(): string{
    const date: Date = new Date();
    return `${date.getDate()}-${date.getMonth()}`;
  }

  checkUrl(url: string): string{
    let urlAth: string;
    this.sessions.authorizedUrl.some(authorized => {
        const include = url.includes(authorized);
        if(include){
          urlAth = `logo-${authorized}`;
        }
        return include;
    });
    return urlAth;
  }

  async registerLastNotification(sendNotification: SendNotification): Promise<void>{
    const sendId: string | null = this.storage.getItemStore('sendNotification');
    if(sendId === null){
      let id: string = await this.db.getNotificationId(this.sessions.user);
      if(id === ''){
        id = await this.db.registerNotification(sendNotification);
      }else{
        this.db.updateRegisterNotification(id ,sendNotification);
      }
      this.storage.setItemStore('sendNotification', id);
    }else{
      this.db.updateRegisterNotification(sendId ,sendNotification);
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
