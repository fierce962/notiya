import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSendNotificationComponent } from './loading-send-notification.component';



@NgModule({
  declarations: [LoadingSendNotificationComponent],
  imports: [
    CommonModule
  ],
  exports: [LoadingSendNotificationComponent]
})
export class LoadingSendNotificationModule { }
