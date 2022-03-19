import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SessionsService } from 'src/app/services/sessions/sessions.service';

@Component({
  selector: 'app-modal-add-img',
  templateUrl: './modal-add-img.component.html',
  styleUrls: ['./modal-add-img.component.scss'],
})
export class ModalAddImgComponent implements OnInit {

  @Output() file: EventEmitter<string | ArrayBuffer> = new EventEmitter();
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();

  imgRout: string | ArrayBuffer = './assets/icon/no-image.png';

  messageError = '';

  validUpload = false;

  constructor(private sessions: SessionsService) { }

  ngOnInit() {
    this.hasImg();
  }

  hasImg(): void{
    if(this.sessions.imgProfile !== undefined && this.sessions.imgProfile !== this.imgRout){
      this.imgRout = this.sessions.imgProfile;
    }
  }

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

  deleteImg(): void{
    this.imgRout = './assets/icon/no-image.png';
    this.validUpload = true;
  }

  closeModal(): void{
    this.cancel.emit(false);
  }
}
