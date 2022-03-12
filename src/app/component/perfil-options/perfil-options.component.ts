import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatabaseService } from 'src/app/services/dataBase/database.service';
import { AuthServiceService } from 'src/app/services/authService/auth-service.service';
import { SessionsService } from 'src/app/services/sessions/sessions.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-perfil-options',
  templateUrl: './perfil-options.component.html',
  styleUrls: ['./perfil-options.component.scss'],
})
export class PerfilOptionsComponent implements OnInit {

  @Input() inputLabel: string;
  @Output() closeOptions = new EventEmitter<boolean>();

  inputType: string;

  formsChange = new FormGroup({
    input1: new FormControl('', Validators.required),
    input2: new FormControl('', Validators.required)
  });

  constructor(private db: DatabaseService, private auth: AuthServiceService,
    private sessions: SessionsService, private storage: StorageService) { }

  ngOnInit() {
    if(this.inputLabel === 'nombre'){
      this.inputType = 'text';
    }else{
      this.inputType = 'password';
    }
  }

  change(): void{
    if(this.inputLabel === 'nombre'){
      this.changeName();
    }else{
      this.changePassword();
    }
  }

  async changeName(): Promise<void>{
    const name = this.formsChange.controls.input1.value;
    if(name !== ''){
      const valid = await this.db.getValidUserName([name]);
      if(valid){
        this.db.setNewUserName(name, this.sessions.user.id);
        this.sessions.user.displayName = name;
        this.storage.setItemStore('user', JSON.stringify(this.sessions.user));
        this.close();
      }else{
        this.formsChange.controls.input1.setErrors({ nameError: true });
      }
    }else{
      this.formsChange.controls.input1.setErrors({ nameRequired: true });
    }
  }

  changePassword(): void{
    if(this.formsChange.valid){
      this.auth.resetPassword(this.formsChange.controls.input1.value);
      this.close();
    }else{
      this.checkRequired();
    }
  }

  checkRequired(): void{
    Object.keys(this.formsChange.controls).forEach(input=>{
      if(this.formsChange.controls[input].value === ''){
        this.formsChange.controls[input].setErrors({ password: true });
      }
    });
  }

  comparePassword(): void{
    if(this.formsChange.controls.input1.value !== this.formsChange.controls.input2.value){
      this.formsChange.controls.input2.setErrors({ diferentPassword: true });
    }
  }

  close(): void{
    this.closeOptions.emit(true);
    this.formsChange.reset();
  }
}
