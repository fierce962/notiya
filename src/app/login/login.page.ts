import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../services/authService/auth-service.service';
import { StorageService } from '../services/storage/storage.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { DatabaseService } from '../services/dataBase/database.service';
import { SubsCriptions, User, UserData } from '../models/interface';
import { OneSignalService } from '../services/OneSignal/one-signal.service';
import { SessionsService } from '../services/sessions/sessions.service';
import { ControlHistoryRoutService } from '../services/ControlHistoryRout/control-history-rout.service';
import { Platform } from '@ionic/angular';
import { BackBtnHistory } from '../models/BackBtnHistory';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });
  user: User;

  modalUserName = false;

  componentUrl: string;

  history = new BackBtnHistory(this, this.controlHistory);

  constructor(private auth: AuthServiceService,
    private storage: StorageService,
    private router: Router,
    private database: DatabaseService,
    private oneSignal: OneSignalService,
    private sessions: SessionsService,
    private platform: Platform,
    private controlHistory: ControlHistoryRoutService) { }

  ngOnInit() {
    this.componentUrl = this.router.url;
    this.platform.backButton.subscribe(()=>{
      if(this.router.url === this.componentUrl){
        console.log('se disparo el btn de login');
        this.history.backHistory();
      };
    });
  }

  async loginWithGoogle(): Promise<void>{
    this.user = await this.auth.loginGoogle();
    const userData: UserData | undefined = await this.database.getUserData(this.user);
    if(userData === undefined){
      this.modalUserName = true;
    }else{
      this.user.displayName = userData.userName[0];
      this.setUserStore();
    }
  }

  async setUsername(userName: string): Promise<void>{
    if(userName !== ''){
      this.user.displayName = userName;
      this.database.setUserData(this.user, userName);
      this.modalUserName = false;
      this.setUserStore();
    };
  }

  setUserStore(): void{
    this.storage.setItemStore('user', JSON.stringify(this.sessions.user));
    this.router.navigate(['']);
  }

  register(): void{
    this.router.navigate(['/register']);
  }

  async signIn(): Promise<void>{
    const user: User | string = await this.auth.loginEmail(this.loginForm.controls.email.value,
          this.loginForm.controls.password.value);
    if(typeof(user) === 'object'){
      this.sessions.user = user;
      const userData: UserData = await this.database.getUserData(this.sessions.user);
      this.sessions.user.displayName = userData.userName[0];

      if(userData.subsCriptions !== 0){
        user.notification = true;
      }

      this.oneSignal.setExternalId(this.sessions.user.uid);

      const subscritiption: SubsCriptions = await this.database.getSubscriptions(this.sessions.user);
      if(subscritiption !== undefined){
        this.storage.setItemStore('subscribed', JSON.stringify(subscritiption));
      }

      this.setUserStore();
    }else if(user === 'auth/user-not-found'){
        this.loginForm.controls.email.setErrors({ emailError: true });
    }else if(user === 'auth/wrong-password'){
      this.loginForm.controls.password.setErrors({ passwordError: true });
    }
  }
}
