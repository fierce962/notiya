import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../services/authService/auth-service.service';
import { StorageService } from '../services/storage/storage.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

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

  constructor(private router: Router,
    private afAuth: AuthServiceService,
    private storage: StorageService) { }

  ngOnInit() {
  }

  cancel(): void{
    this.router.navigate(['login']);
  }

  verifiedPassword(): void{
    if(this.registerFrom.controls.fisrtPassword.value !== this.registerFrom.controls.verifiedPassword.value){
      this.equalPassword = true;
      this.registerFrom.controls.verifiedPassword.setErrors({ error: true });
    }else{
      this.registerFrom.controls.verifiedPassword.setErrors(null);
      this.equalPassword = false;
    }
  }

  register(): void{
    this.afAuth.register(this.registerFrom.controls.email.value,
      this.registerFrom.controls.fisrtPassword.value)
      .then(user=>{
        this.storage.setItemStore('user', JSON.stringify(user));
        this.router.navigate(['']);
      }).catch(error=>{
        if(error === 'auth/email-already-in-use'){
          this.emailInUsed = true;
        }
      });
  }

}
