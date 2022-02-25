import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';
import { GoogleUserNameModule } from '../component/google-user-name/google-user-name.module';
import { LoadingModule } from '../component/loading/loading.module';

import { LoginPage } from './login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    LoginPageRoutingModule,
    GoogleUserNameModule,
    LoadingModule
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {}
