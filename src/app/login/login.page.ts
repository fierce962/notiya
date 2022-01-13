import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../services/authService/auth-service.service';
import { User } from '../models/interface';
import { StorageService } from '../services/storage/storage.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

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

  constructor(private auth: AuthServiceService, private storage: StorageService, private router: Router) { }

  ngOnInit() {
  }

  async loginWithGoogle(): Promise<void>{
    const user: User = await this.auth.loginGoogle();
    this.storage.setItemStore('user', JSON.stringify(user));
    this.router.navigate(['']);
  }

  register(): void{
    this.router.navigate(['register']);
  }

  async signOut(): Promise<void>{
    await this.auth.loginEmail(this.loginForm.controls.email.value,
        this.loginForm.controls.password.value)
        .then(user=>{
          this.storage.setItemStore('user', JSON.stringify(user));
          this.router.navigate(['']);
        }).catch(error=>{
          if(error === 'auth/user-not-found'){
            this.loginForm.controls.email.setErrors({ emailError: true });
          }else if(error === 'auth/wrong-password'){
            this.loginForm.controls.password.setErrors({ passwordError: true });
          }
        });
  }
}
