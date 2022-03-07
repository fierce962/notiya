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

  constructor(private sessions: SessionsService,
    private store: StorageService,
    private db: DatabaseService) { }

  ngOnInit() {
    this.subscriptions = JSON.parse(this.store.getItemStore('subscribed'));
    this.hasStoreSubCription();
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
      let subscrition: Subscription;
      if(this.subscriptions === null){
        subscrition = await this.addSubcriptions(userSearch);
      }else{
        subscrition = await this.updateSubscriptions(userSearch);
      }
      this.sessions.newSubscriptions.push(subscrition);
      userSearch.subscribe = true;
      userSearch.awaitSubscribe = undefined;
      userSearch.subsCriptions += 1;
      this.db.updateUserSubscription(userSearch.uid, 1);
      this.store.setItemStore('subscribed', JSON.stringify(this.subscriptions));
    }
  }

  async addSubcriptions(user: UserData): Promise<Subscription>{
    const subscrition: Subscription = await this.createSubscription(user);
    this.subscriptions = {
      uid: this.sessions.user.uid,
      subsCriptions: [subscrition]
    };
    this.db.addSubcriptions(this.subscriptions);
    return subscrition;
  }

  async createSubscription(user: UserData): Promise<Subscription>{
    return {
      uid: user.uid,
      url: '',
      notificationId: await this.createListNotification(user)
    };
  }

  removeSubscription(user: UserData): void{
    this.subscriptions.subsCriptions = this.subscriptions.subsCriptions.filter(sub =>{
      let diferentUser = true;
      if(sub.uid === user.uid){
        this.db.removeListNotification(sub.notificationId);
        diferentUser = false;
      }
      return diferentUser;
    });
    this.sessions.setremoveSubscription(user.uid);
    this.db.updateSubscriptions(this.subscriptions);
    user.subsCriptions -= 1;
    this.db.updateUserSubscription(user.uid, -1);
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

  async updateSubscriptions(user: UserData): Promise<Subscription>{
    const subscrition = await this.createSubscription(user);
    this.subscriptions.subsCriptions.push(subscrition);
    this.db.updateSubscriptions(this.subscriptions);
    return subscrition;
  }

  async createListNotification(userSearch: UserData): Promise<string>{
    return await this.db.addListNotification({
      uidCreator: userSearch.uid,
      token: this.sessions.user.uid
    });
  }

}
