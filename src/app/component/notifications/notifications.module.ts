import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { NotificationsComponent } from './notifications.component';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [NotificationsComponent],
  exports: [NotificationsComponent]
})
export class NotificationsModule { }
