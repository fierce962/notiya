import { Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DatabaseService } from 'src/app/services/dataBase/database.service';
import { AuthServiceService } from 'src/app/services/authService/auth-service.service';

@Component({
  selector: 'app-perfil-options',
  templateUrl: './perfil-options.component.html',
  styleUrls: ['./perfil-options.component.scss'],
})
export class PerfilOptionsComponent implements OnInit {

  @Input() inputLabel: string;
  @ViewChildren('input', { read: ElementRef }) inputs: QueryList<ElementRef>;

  errorMessange: string;

  constructor(private db: DatabaseService, private Auth: AuthServiceService) { }

  ngOnInit() {}

  change(): void{
    if(this.inputLabel === 'nombre'){
      this.changeName();
    }else{

    }
  }

  async changeName(): Promise<void>{
    let name: string;
    this.inputs.some(input => {
      name = input.nativeElement.value;
      return true;
    });
    const valid = await this.db.getUserDataName([name]);
    if(valid){

    }else{
      this.errorMessange = 'El nombre ya esta en uso';
    }
  }

  changePassword(): void{

  }
}
