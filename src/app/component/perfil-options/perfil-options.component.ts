import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { DatabaseService } from 'src/app/services/dataBase/database.service';
import { AuthServiceService } from 'src/app/services/authService/auth-service.service';
import { SessionsService } from 'src/app/services/sessions/sessions.service';
import { StorageService } from 'src/app/services/storage/storage.service';
@Component({
  selector: 'app-perfil-options',
  templateUrl: './perfil-options.component.html',
  styleUrls: ['./perfil-options.component.scss'],
})
export class PerfilOptionsComponent implements OnInit {

  @Input() inputLabel: string;
  @Output() closeOptions = new EventEmitter<boolean>();
  @ViewChildren('input', { read: ElementRef }) inputs: QueryList<ElementRef>;

  errorMessange1: string;
  errorMessange2: string;
  errorInput1 = false;
  errorInput2 = false;
  inputType: string;

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
    let name: string;
    this.inputs.some(input => {
      name = input.nativeElement.value;
      return true;
    });
    if(name !== ''){
      const valid = await this.db.getValidUserName([name]);
      if(valid){
        this.db.setNewUserName(name, this.sessions.user.id);
        this.sessions.user.displayName = name;
        this.storage.setItemStore('user', JSON.stringify(this.sessions.user));
        this.close();
      }else{
        this.errorMessange1 = 'El nombre ya esta en uso';
        this.errorInput1 = true;
      }
    }else{
      this.errorMessange1 = 'Debe introducir un nombre';
      this.errorInput1 = true;
    }
  }

  changePassword(): void{
    const password: string[] = [];
    this.inputs.forEach(input => {
      password.push(input.nativeElement.value);
    });
    console.log(password);
    if(password[0] === ''){
      this.errorInput1 = true;
      this.errorMessange1 = 'Debe introducir una clave';
    }else if(password[1] === ''){
      this.errorInput2 = true;
      this.errorMessange2 = 'Repetir la clave';
    }else if(password[0] !== password[1]){
      this.errorInput2 = true;
      this.errorMessange2= 'las claves no coinciden';
    }else{
      this.auth.resetPassword(password[0]);
      this.close();
    }
  }

  close(): void{
    this.closeOptions.emit(true);
  }
}
