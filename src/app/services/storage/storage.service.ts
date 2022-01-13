import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  getItemStore(key: string): string{
    return localStorage.getItem(key);
  }

  setItemStore(key: string, value: string): void{
    localStorage.setItem(key, value);
  }

  clearStore(): void{
    localStorage.clear();
  }
}
