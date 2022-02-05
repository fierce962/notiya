import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../services/authService/auth-service.service';
import { StorageService } from '../services/storage/storage.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { DatabaseService } from '../services/dataBase/database.service';
import { User, UserData } from '../models/interface';
import { OneSignalService } from '../services/OneSignal/one-signal.service';

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

  constructor(private auth: AuthServiceService,
    private storage: StorageService,
    private router: Router,
    private database: DatabaseService,
    private oneSignal: OneSignalService) { }

  ngOnInit() {
  }

  async loginWithGoogle(): Promise<void>{
    this.user = await this.auth.loginGoogle();
    const userData: UserData | undefined = await this.database.getUserData(this.user);
    if(userData === undefined){
      this.modalUserName = true;
    }else{
      this.user.displayName = userData.userName[0];
      this.user.playerId = userData.playerId;
      this.setUserStore();
    }
  }

  async setUsername(userName: string): Promise<void>{
    if(userName !== ''){
      this.user.displayName = userName;
      this.user.playerId = await this.oneSignal.getPlayerId();
      this.database.setUserData(this.user, userName);
      this.modalUserName = false;
      this.setUserStore();
    };
  }

  setUserStore(): void{
    this.storage.setItemStore('user', JSON.stringify(this.user));
    this.router.navigate(['']);
  }

  register(): void{
    this.router.navigate(['register']);
  }

  async signIn(): Promise<void>{
    await this.auth.loginEmail(this.loginForm.controls.email.value,
        this.loginForm.controls.password.value)
        .then(user=>{
          this.user = user;
          this.database.getUserData(this.user).then(userData => {
            this.user.displayName = userData.userName[0];
            this.user.playerId = userData.playerId;
            this.setUserStore();
          });
        }).catch(error=>{
          if(error === 'auth/user-not-found'){
            this.loginForm.controls.email.setErrors({ emailError: true });
          }else if(error === 'auth/wrong-password'){
            this.loginForm.controls.password.setErrors({ passwordError: true });
          }
        });
  }
}
