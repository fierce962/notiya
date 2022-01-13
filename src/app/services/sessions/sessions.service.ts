import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { User } from 'src/app/models/interface';

@Injectable({
  providedIn: 'root'
})
export class SessionsService {

  user: User;

  constructor(private storage: StorageService) { }

  getUserLogin(): void{
    this.user = JSON.parse(this.storage.getItemStore('user'));
  }
}
