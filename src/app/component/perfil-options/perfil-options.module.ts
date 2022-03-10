import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { PerfilOptionsComponent } from './perfil-options.component';

@NgModule({
  declarations: [PerfilOptionsComponent],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [PerfilOptionsComponent]
})
export class PerfilOptionsModule { }
