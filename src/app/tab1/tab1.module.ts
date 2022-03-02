import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { Tab1PageRoutingModule } from './tab1-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UserSearchModule } from '../component/user-search/user-search.module';
import { NotificationsModule } from '../component/notifications/notifications.module';
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab1PageRoutingModule,
    NotificationsModule,
    ReactiveFormsModule,
    UserSearchModule
  ],
  declarations: [Tab1Page]
})
export class Tab1PageModule {}
