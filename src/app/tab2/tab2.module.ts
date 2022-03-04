import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingSendNotificationModule } from '../component/loading-send-notification/loading-send-notification.module';

import { Tab2PageRoutingModule } from './tab2-routing.module';
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab2PageRoutingModule,
    ReactiveFormsModule,
    LoadingSendNotificationModule
  ],
  declarations: [Tab2Page]
})
export class Tab2PageModule {}
