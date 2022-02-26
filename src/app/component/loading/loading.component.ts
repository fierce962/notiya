import { Component, OnInit, } from '@angular/core';
import { Renderer2 } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {

  constructor(private renderer: Renderer2) { }

  ngOnInit() {

  }

}
