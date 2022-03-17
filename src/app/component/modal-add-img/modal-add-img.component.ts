import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal-add-img',
  templateUrl: './modal-add-img.component.html',
  styleUrls: ['./modal-add-img.component.scss'],
})
export class ModalAddImgComponent implements OnInit {

  @Output() file: EventEmitter<string | ArrayBuffer> = new EventEmitter();

  imgRout: string | ArrayBuffer = './assets/icon/no-image.png';

  messageError = '';

  validUpload = false;

  constructor() { }

  ngOnInit() {}

  addImg(event: any): void{
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.imgRout = reader.result;
    };
    this.validUpload = this.imgValid(event);
  }

  imgValid(event: any): boolean{
    if(event.target.files[0].size > 4e+6){
      this.messageError = 'sizeMax';
      return false;
    }else if(event.target.files[0].type !== 'image/png'){
      this.messageError = 'errorType';
      return false;
    }
    this.messageError = '';
    return true;
  }

  uploadFile(): void{
    this.file.emit(this.imgRout);
  }
}
