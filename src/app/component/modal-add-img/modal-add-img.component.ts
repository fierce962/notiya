import { Component, OnInit } from '@angular/core';
import { SessionsService } from 'src/app/services/sessions/sessions.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { DatabaseService } from 'src/app/services/dataBase/database.service';

@Component({
  selector: 'app-modal-add-img',
  templateUrl: './modal-add-img.component.html',
  styleUrls: ['./modal-add-img.component.scss'],
})
export class ModalAddImgComponent implements OnInit {

  imgRout: string | ArrayBuffer = './assets/icon/no-image.png';

  messageError = '';

  validUpload = false;

  constructor(private sessions: SessionsService,
    private storage: StorageService, private database: DatabaseService) { }

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
    this.sessions.imgProfile = this.imgRout;
    this.database.updateImg(JSON.stringify(this.imgRout), this.sessions.user.reference);
    this.storage.setItemStore('profileImg', JSON.stringify(this.imgRout));
    this.sessions.setModalCloseImg();
  }
}
