import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { PerfilOptionsComponent } from './perfil-options.component';

@NgModule({
  declarations: [PerfilOptionsComponent],
  imports: [
    CommonModule, IonicModule
  ],
  exports: [PerfilOptionsComponent]
})
export class PerfilOptionsModule { }
