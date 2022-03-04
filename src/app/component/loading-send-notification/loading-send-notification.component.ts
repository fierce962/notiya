import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-send-notification',
  templateUrl: './loading-send-notification.component.html',
  styleUrls: ['./loading-send-notification.component.scss'],
})
export class LoadingSendNotificationComponent implements OnInit {

  send = false;

  constructor() { }

  ngOnInit() {
    console.log('hola2');
    setTimeout(() => {
      console.log('hola');
      this.send = true;
    }, 2000);
  }

}
