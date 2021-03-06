import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../services/authService/auth-service.service';
import { StorageService } from '../services/storage/storage.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { DatabaseService } from '../services/dataBase/database.service';
import { SubsCriptions, User, UserData, GetUserData } from '../models/interface';
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

  loading = false;

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
        this.history.backHistory();
      };
    });
  }

  async loginWithGoogle(): Promise<void>{
    this.user = await this.auth.loginGoogle();
    const userData: GetUserData | undefined = await this.database.getUserData(this.user);
    if(userData === undefined){
      this.modalUserName = true;
    }else{
      this.user.displayName = userData.name;
      this.setUserStore();
    }
  }

  ionViewWillLeave(): void{
    this.clearInput();
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
  }

  register(): void{
    this.router.navigate(['/tabs/register']);
  }

  async signIn(): Promise<void>{
    this.closeLoading();
    this.loading = true;
    const user: User | string = await this.auth.loginEmail(this.loginForm.controls.email.value,
          this.loginForm.controls.password.value);
    if(typeof(user) === 'object'){
      this.sessions.user = user;
      const userData: GetUserData = await this.database.getUserData(this.sessions.user);
      this.sessions.user.displayName = userData.name;
      this.sessions.user.reference = userData.id;

      if(userData.img !== undefined){
        this.sessions.imgProfile = JSON.parse(userData.img);
        this.storage.setItemStore('profileImg', userData.img);
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

  closeLoading(): void{
    setTimeout(() => {
      const user: string = this.storage.getItemStore('user');
      if(user !== null){
        this.loading = false;
        this.router.navigate(['']);
      }else{
        this.loading = false;
      }
    }, 4000);
  }

  clearInput(): void{
    this.loginForm.reset();
  }
}
