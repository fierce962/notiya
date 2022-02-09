/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, addDoc, updateDoc, increment, deleteDoc, doc } from 'firebase/firestore';
import { ParseUserNameService } from '../parseUserName/parse-user-name.service';
import { UserData, User, SubsCriptions, ListNotification, SendNotification } from 'src/app/models/interface';

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

  async getSubscriptions(user: User): Promise<SubsCriptions>{
    return await getDocs(query(collection(this.db, 'subscribed'), where('uid', '==', user.uid)))
    .then(results=>{
      const subscription: any =results.docs[0].data();
      return subscription;
    });
  }

  async addSubcriptions(subscriptions: SubsCriptions): Promise<void>{
    await addDoc(collection(this.db, 'subscribed'), subscriptions);
  }

  async updateSubscriptions(subscriptions: SubsCriptions): Promise<void>{
    await getDocs(query(collection(this.db, 'subscribed'), where('uid', '==', subscriptions.uid)))
    .then(results=>{
      updateDoc(results.docs[0].ref, { subsCriptions: subscriptions.subsCriptions });
    });
  }

  async updateUserSubscription(uid: string, incrementSub: number): Promise<void>{
    await getDocs(query(collection(this.db, 'userData'), where('uid', '==', uid)))
    .then(results=>{
      updateDoc(results.docs[0].ref, { subsCriptions: increment(incrementSub) });
    });
  }

  async addListNotification(list: ListNotification): Promise<string>{
    return new Promise((resolve)=>{
      addDoc(collection(this.db, 'ListenerNotification'), list).then(result => {
        resolve(result.id);
      });
    });
  }

  removeListNotification(notificationId: string): void{
    deleteDoc(doc(this.db, 'ListenerNotification', notificationId));
  }

  async getListenerNotification(uid: string): Promise<string[]>{
    return await getDocs(query(collection(this.db, 'ListenerNotification'), where('uidCreator', '==', uid)))
    .then(results=>{
      const tokens: string[] = [];
      results.docs.forEach((result: any)=>{
        tokens.push(result.data().token);
      });
      return tokens;
    });
  }

  async registerNotification(sendNotification: SendNotification): Promise<string>{
    return await addDoc(collection(this.db, 'sendNotification'), sendNotification)
    .then(result=> result.id);
  }

  async updateRegisterNotification(id: string, sendNotification: SendNotification | any){
    await updateDoc(doc(this.db, 'sendNotification', id), sendNotification);
  }
}
