import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetworkErrorComponent } from './network-error.component';


@NgModule({
  declarations: [NetworkErrorComponent],
  imports: [
    CommonModule
  ],
  exports: [NetworkErrorComponent]
})
export class NetworkErrorModule { }
