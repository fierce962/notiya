import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, orderBy, startAt, endAt } from 'firebase/firestore';
import { addDoc } from '@angular/fire/firestore';
import { UserData, User } from 'src/app/models/interface';
import { ParseUserNameService } from '../parseUserName/parse-user-name.service';

const app = initializeApp(environment.firebaseConfig);

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private db = getFirestore(app);

  constructor(private parseUser: ParseUserNameService) { }

  async setUserData(user: User, name: string): Promise<void>{
    const userData: UserData = {
      uid: user.uid,
      userName: this.parseUser.get(user.displayName),
      fullName: name,
      subsCriptions: 0
    };
    await addDoc(collection(this.db, 'userData'), userData);
  };

  async getUserData(user: User): Promise<any>{
    return await getDocs(query(collection(this.db, 'userData'), where('uid', '==', user.uid)))
    .then(results => results.docs[0].data());
  }

  async shearchUsers(search: string, startText: string, endText: string): Promise<void>{
    await getDocs(query(collection(this.db, 'userData'),
    orderBy('userName'),
    startAt('fierce'),
      )).then(results=>{
        results.docs.forEach(e=>{
          console.log(e.data());
        });
      });
  };
}
