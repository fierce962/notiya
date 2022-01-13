import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../services/authService/auth-service.service';
import { User } from '../models/interface';
import { StorageService } from '../services/storage/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

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
}
