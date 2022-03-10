import { Component, OnInit } from '@angular/core';
import { getApp } from 'firebase/app';
import { getStorage, ref, uploadBytes } from '@firebase/storage';
import { SessionsService } from 'src/app/services/sessions/sessions.service';

@Component({
  selector: 'app-modal-add-img',
  templateUrl: './modal-add-img.component.html',
  styleUrls: ['./modal-add-img.component.scss'],
})
export class ModalAddImgComponent implements OnInit {

  imgRout: string | ArrayBuffer = './assets/icon/no-image.png';

  file: any;

  messageError = '';

  validUpload = false;

  constructor(private sessions: SessionsService) { }

  ngOnInit() {}

  addImg(event: any): void{
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.imgRout = reader.result;
    };
    this.file = event.target.files[0];
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
    const storage = getStorage(getApp());
    const reference = ref(storage, `profile-${this.sessions.user.displayName}`);
    uploadBytes(reference, this.file).then((snapshot) => {
      console.log('Uploaded a blob or file!');
    });
  }
}
