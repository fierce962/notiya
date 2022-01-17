import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, addDoc, updateDoc, doc } from 'firebase/firestore';
import { UserData, User, SubsCriptions } from 'src/app/models/interface';
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
    .then(results => {
      if(results.docs.length !== 0){
        return results.docs[0].data();
      }else{
        return undefined;
      }
    });
  }

  async shearchUsers(search: string[]): Promise<UserData[]>{
    return await getDocs(query(collection(this.db, 'userData'),
      where('userName', 'array-contains-any', search)))
        .then(results=>{
        const users: UserData[] = [];
        results.docs.forEach((user: any)=>{
          users.push(user.data());
        });
        return users;
      });
  };

  async addSubcriptions(subscriptions: SubsCriptions): Promise<void>{
    await addDoc(collection(this.db, 'subscriptions'), subscriptions);
  }

  async updateSubscriptions(subscriptions: SubsCriptions): Promise<void>{
    await getDocs(query(collection(this.db, 'subscriptions'), where('uid', '==', subscriptions.uid)))
    .then(results=>{
      updateDoc(results.docs[0].ref, { subsCriptions: subscriptions.subsCriptions });
    });
  }
}
