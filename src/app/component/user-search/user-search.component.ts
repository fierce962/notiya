import { Component, Input, OnInit } from '@angular/core';
import { UserData, SubsCriptions, Subscription } from 'src/app/models/interface';
import { SessionsService } from 'src/app/services/sessions/sessions.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { DatabaseService } from '../../services/dataBase/database.service';
@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss'],
})
export class UserSearchComponent implements OnInit {
  @Input() searchsUsers: UserData[];
  subscriptions: SubsCriptions | null;

  constructor(public sessions: SessionsService,
    private store: StorageService,
    private db: DatabaseService) { }

  ngOnInit() {
    console.log(this.searchsUsers);
    this.subscriptions = JSON.parse(this.store.getItemStore('subscribed'));
    this.parseImg();
    this.hasStoreSubCription();
  }

  parseImg(): void{
    this.searchsUsers.forEach(user =>{
      if(user.img !== undefined){
        user.img = JSON.parse(user.img);
      }
    });
  }

  hasStoreSubCription(): void{
    if(this.subscriptions !== null){
      this.subscriptions.subsCriptions.forEach(subs => {
        this.searchsUsers.forEach(users => {
          if(subs.uid === users.uid){
            users.subscribe = true;
          };
        });
      });
    }
  }

  async addNewsubCription(userSearch: UserData): Promise<void>{
    if(userSearch.awaitSubscribe === undefined){
      userSearch.awaitSubscribe = true;
      const subscrition: Subscription = await this.createSubscription(userSearch);
      await this.addSubcriptions(subscrition);
      this.sessions.newSubscriptions.push(subscrition);
      userSearch.subscribe = true;
      userSearch.awaitSubscribe = undefined;
      userSearch.subsCriptions += 1;
      this.db.updateUserSubscription(1, userSearch.reference);
      this.store.setItemStore('subscribed', JSON.stringify(this.subscriptions));
    }
  }

  async createSubscription(user: UserData): Promise<Subscription>{
    return {
      uid: user.uid,
      url: '',
      notificationId: await this.createListNotification(user)
    };
  }

  async createListNotification(userSearch: UserData): Promise<string>{
    return await this.db.addListNotification({
      uidCreator: userSearch.uid,
      token: this.sessions.user.uid
    });
  }

  async addSubcriptions(subscrition: Subscription): Promise<void>{
    if(this.subscriptions === null){
      this.subscriptions = {
        uid: this.sessions.user.uid,
        subsCriptions: [subscrition]
      };
      this.subscriptions.reference = await this.db.addSubcriptions(this.subscriptions);
    }else{
      this.subscriptions.subsCriptions.push(subscrition);
      this.db.updateSubscriptions(this.subscriptions);
    }
  }

  async removeSubscription(user: UserData): Promise<void>{
    this.subscriptions.subsCriptions = this.subscriptions.subsCriptions.filter(sub =>{
      if(sub.uid === user.uid){
        this.db.removeListNotification(sub.notificationId);
        return false;
      }
      return true;
    });
    this.sessions.setremoveSubscription(user.uid);
    this.db.updateSubscriptions(this.subscriptions);
    this.db.updateUserSubscription(-1, user.reference);
    user.subsCriptions -= 1;
    user.subscribe = undefined;
    this.removeNewSubscription(user);
    this.store.setItemStore('subscribed', JSON.stringify(this.subscriptions));
  }

  removeNewSubscription(user: UserData): void{
    const newSubscriptions = this.sessions.newSubscriptions;
    if(newSubscriptions.length !== 0){
      newSubscriptions.some((subscription, index) => {
        if(subscription.uid === user.uid){
          newSubscriptions.splice(index, 1);
          return true;
        }
      });
    }
  }

}
