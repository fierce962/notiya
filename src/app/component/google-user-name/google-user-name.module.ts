import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GoogleUserNameComponent } from './google-user-name.component';

@NgModule({
  declarations: [GoogleUserNameComponent],
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
  exports: [GoogleUserNameComponent]
})
export class GoogleUserNameModule { }
