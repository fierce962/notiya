/* eslint-disable @typescript-eslint/member-ordering */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-google-user-name',
  templateUrl: './google-user-name.component.html',
  styleUrls: ['./google-user-name.component.scss'],
})
export class GoogleUserNameComponent implements OnInit {

  userName = new FormControl();
  @Output() user = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit() {
  }

  sendUserName(): void{
    if(this.userName.value !== ''){
      this.user.emit(this.userName.value);
    }
  }

}
