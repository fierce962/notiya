/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where,
  addDoc, updateDoc, increment, deleteDoc, doc, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { ParseUserNameService } from '../parseUserName/parse-user-name.service';
import { UserData, User, SubsCriptions, ListNotification, SendNotification, GetUserData } from 'src/app/models/interface';
import { NetworkService } from '../network/network.service';


const app = initializeApp(environment.firebaseConfig);

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private db = getFirestore(app);

  constructor(private parseUser: ParseUserNameService, private network: NetworkService) { }

  async setUserData(user: User, name: string): Promise<void>{
    const userData: UserData = {
      uid: user.uid,
      userName: this.parseUser.get(user.displayName),
      fullName: name,
      subsCriptions: 0
    };
    await addDoc(collection(this.db, 'userData'), userData);
  };

  async getValidUserName(name: string[]): Promise<boolean>{
    console.log(name);
    return await getDocs(query(collection(this.db, 'userData'),
      where('userName', 'array-contains-any', name)))
      .then(results => {
        if(results.docs.length !== 0){
          return false;
        }else{
          return true;
        }
      });
  }

  setNewUserName(newUserName: string, id: string): void{
    const newName = this.parseUser.get(newUserName);
    updateDoc(doc(this.db, 'userData', id), { userName: newName });
  }

  async getUserData(user: User): Promise<GetUserData>{
    return await getDocs(query(collection(this.db, 'userData'), where('uid', '==', user.uid)))
    .then(results => {
      if(results.docs.length !== 0){
        const userData: UserData | any = results.docs[0].data();
        return {
          id: results.docs[0].id,
          name: userData.userName[0]
        };
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
      if(results.docs.length !== 0){
        const subscription: any =results.docs[0].data();
        return subscription;
      }else{
        return undefined;
      }
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
    console.log('listener');
    const results = await getDocs(query(collection(this.db, 'ListenerNotification'),
    where('uidCreator', '==', uid)));
    const tokens: string[] = [];
    results.docs.forEach((result: any)=>{
      tokens.push(result.data().token);
    });
    if(results.metadata.fromCache){
      console.log('esperando');
      await this.network.getConectionStatus();
      return this.getListenerNotification(uid);
    };
    return tokens;
  }

  async getNotifications(subscritionsId: string[]): Promise<QueryDocumentSnapshot<DocumentData>[]>{
    const results = await getDocs(query(collection(this.db, 'sendNotification'),
    where('uid', 'in', subscritionsId)));
    if(results.metadata.fromCache){
      await this.network.getConectionStatus();
      return await this.getNotifications(subscritionsId);
    }
    return results.docs;
  }

  async getNotificationId(user: User): Promise<string>{
    const results = await getDocs(query(collection(this.db, 'sendNotification'),
    where('uid', '==', user.uid)));
    if(results.docs.length !== 0){
      return results.docs[0].id;
    }
    if(results.metadata.fromCache){
      await this.network.getConectionStatus();
      return await this.getNotificationId(user);
    };
    return '';
  }

  async registerNotification(sendNotification: SendNotification): Promise<string>{
    const result = await addDoc(collection(this.db, 'sendNotification'), sendNotification);
    if(result.id !== ''){
      return result.id;
    }else{
      await this.network.getConectionStatus();
      return await this.registerNotification(sendNotification);
    }
  }

  async updateRegisterNotification(id: string, sendNotification: SendNotification | any): Promise<void>{
    await updateDoc(doc(this.db, 'sendNotification', id), sendNotification);
  }
}
