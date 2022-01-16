import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { UserSearchComponent } from './user-search.component';

@NgModule({
  declarations: [UserSearchComponent],
  imports: [
    CommonModule, IonicModule
  ],
  exports: [UserSearchComponent]
})
export class UserSearchModule { }
