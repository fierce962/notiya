import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Renderer2 } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit, AfterViewInit {

  @ViewChild('two', { read: ElementRef } ) two: ElementRef;
  @ViewChild('one', { read: ElementRef } ) one: ElementRef;

  constructor(private renderer: Renderer2) { }

  ngAfterViewInit(): void {
    this.renderer.addClass(this.one.nativeElement, 'loading__one');
    this.renderer.addClass(this.two.nativeElement, 'loading__two');
    // setInterval(()=>{
    //   console.log('hola');
    //   this.renderer.setStyle(this.one.nativeElement, 'animation', 'pause');
    //   this.renderer.setStyle(this.one.nativeElement, 'animation', 'running');
    // }, 30000);
  }

  ngOnInit() {

  }

}
