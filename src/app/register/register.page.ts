import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../services/authService/auth-service.service';
import { StorageService } from '../services/storage/storage.service';
import { DatabaseService } from '../services/dataBase/database.service';
import { OneSignalService } from '../services/OneSignal/one-signal.service';
import { SessionsService } from '../services/sessions/sessions.service';
import { ControlHistoryRoutService } from '../services/ControlHistoryRout/control-history-rout.service';
import { Platform } from '@ionic/angular';
import { BackBtnHistory } from '../models/BackBtnHistory';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  @ViewChild('fisrtPassword', { read: ElementRef }) first: ElementRef;
  @ViewChild('verified', { read: ElementRef }) verified: ElementRef;

  registerFrom = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    fullName: new FormControl('', [Validators.required]),
    fisrtPassword: new FormControl('', [Validators.required]),
    verifiedPassword: new FormControl('', [Validators.required])
  });

  equalPassword = false;

  emailInUsed = false;

  componentUrl: string;

  history = new BackBtnHistory(this, this.controlHistory);

  constructor(private router: Router,
    private afAuth: AuthServiceService,
    private storage: StorageService,
    private database: DatabaseService,
    private onesignal: OneSignalService,
    private sessions: SessionsService,
    private platform: Platform,
    private controlHistory: ControlHistoryRoutService) { }

  ngOnInit() {
    this.componentUrl = this.router.url;
    this.platform.backButton.subscribe(()=>{
      if(this.router.url === this.componentUrl){
        this.history.backHistory();
      };
    });
  }

  cancel(): void{
    this.router.navigate(['/tabs/login']);
  }

  verifiedPassword(): void{
    if(this.first.nativeElement.value !== this.verified.nativeElement.value){
      this.equalPassword = true;
      this.registerFrom.controls.verifiedPassword.setErrors({ error: true });
    }else{
      this.registerFrom.controls.verifiedPassword.setErrors(null);
      this.equalPassword = false;
    }
  }

  async register(): Promise<void>{
    this.afAuth.register(this.registerFrom.controls.email.value,
      this.registerFrom.controls.fisrtPassword.value)
      .then(user=>{
        user.displayName = this.registerFrom.controls.userName.value;
        this.database.setUserData(user, this.registerFrom.controls.fullName.value)
        .then(reference => {
          user.reference = reference;
          this.storage.setItemStore('user', JSON.stringify(user));
          this.sessions.user = user;
          this.onesignal.setExternalId(user.uid);
          this.router.navigate(['']);
        });
      }).catch(error=>{
        if(error === 'auth/email-already-in-use'){
          this.emailInUsed = true;
        }
      });
  };

}
