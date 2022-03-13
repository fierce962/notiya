import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParseUserNameService {

  constructor() { }

  get(userName: string): string[]{
    const longStart: number = userName.length / 2;
    const startText: string = userName.slice(0, longStart);
    const endText: string = userName.slice(longStart);
    return [userName,
      userName.toLowerCase(),
      startText.toLocaleLowerCase(),
      endText.toLocaleLowerCase()];
  }
}
