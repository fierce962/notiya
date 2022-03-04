import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSendNotificationComponent } from './loading-send-notification.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [LoadingSendNotificationComponent],
  imports: [
    IonicModule,
    CommonModule
  ],
  exports: [LoadingSendNotificationComponent]
})
export class LoadingSendNotificationModule { }
