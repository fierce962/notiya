/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OneSignalService } from '../services/OneSignal/one-signal.service';
import { DatabaseService } from '../services/dataBase/database.service';
import { SessionsService } from '../services/sessions/sessions.service';
import { StorageService } from '../services/storage/storage.service';
import { SendNotification, UserData } from 'src/app/models/interface';
import { BackBtnHistory } from '../models/BackBtnHistory';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { ControlHistoryRoutService } from '../services/ControlHistoryRout/control-history-rout.service';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  history = new BackBtnHistory(this, this.controlHistory);
  componentUrl: string;

  notificaion = new FormGroup({
    titulo: new FormControl('', [Validators.required]),
    mensaje: new FormControl('', [Validators.required]),
    url: new FormControl('', [Validators.required])
  });

  constructor(private oneSignal: OneSignalService,
    private db: DatabaseService,
    private sessions: SessionsService,
    private storage: StorageService,
    private platform: Platform,
    private router: Router,
    private controlHistory: ControlHistoryRoutService,
    private zone: NgZone) {}

  ngOnInit(): void {
    this.componentUrl = this.router.url;
    this.platform.backButton.subscribe(()=>{
      if(this.router.url === this.componentUrl){
        this.zone.run(()=>{
          this.notificaion.reset();
          this.history.backHistory();
        });
      };
    });
  }

  async sendNotification(): Promise<void>{
    if(this.notificaion.valid){
      this.sessions.viewLoadingSend = true;
      const sendNotification: SendNotification = this.createNotification();
      const tokens: string[] = await this.db.getListenerNotification(this.sessions.user.uid);
      if(tokens.length !== 0){
        this.registerLastNotification(sendNotification);
        await this.send(sendNotification, tokens);
        this.sessions.setSendNotification('enviado');
      }else{
        this.sessions.setSendNotification('Error tiene 0 subscripciones');
      };
    }else{
      this.viewInputError();
    }
  }

  async send(sendNotification: SendNotification, tokens: string[]): Promise<string[]>{
    if(tokens.length < 2000){
      return [await this.oneSignal.send(sendNotification, tokens)];
    }else{
      let reduceTokens: string[] = [];
      const tokensPositionEnd: number = tokens.length - 1;
      return await Promise.all(
        tokens.map((token, index)=>{
          reduceTokens.push(token);
          if(reduceTokens.length === 2000){
            const sendTokens: string[] = [... reduceTokens];
            reduceTokens = [];
            return this.oneSignal.send(sendNotification, sendTokens);
          }else if(tokensPositionEnd === index){
            return this.oneSignal.send(sendNotification, reduceTokens);
          }else{
            return '';
          }
        })
      );
    }
  }

  validUrl(): void{
    let urlValid = false;
    this.sessions.authorizedUrl.some(url =>{
      if(this.notificaion.controls.url.value !== '' &&
        this.notificaion.controls.url.value.indexOf(url) > -1){
          urlValid = true;
          return true;
        };
    });
    if(!urlValid){
      this.notificaion.controls.url.setErrors({ errorUrl: true });
    };
  }

  createNotification(): SendNotification{
    const sendNotification: SendNotification = {
      uid: this.sessions.user.uid,
      title: this.notificaion.controls.titulo.value,
      message: this.notificaion.controls.mensaje.value,
      url: this.notificaion.controls.url.value,
      userName: this.sessions.user.displayName,
      urlAuth: this.parseUrlAuth(this.notificaion.controls.url.value),
      date: this.createDate()
    };
    return sendNotification;
  }

  createDate(): string{
    const date: Date = new Date();
    return `${date.getDate()}-${date.getMonth()}`;
  }

  parseUrlAuth(url: string): string{
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
      this.db.updateRegisterNotification(sendId, sendNotification);
    }
  }

  viewInputError(): void{
    Object.keys(this.notificaion.controls).forEach(input=>{
      if(!this.notificaion.controls[input].valid
        && this.notificaion.controls[input].errors === null){
        this.notificaion.controls[input].setErrors({error: 'error'});
      }
    });
  }

  cancel(): void{
    this.notificaion.reset();
  }

}
