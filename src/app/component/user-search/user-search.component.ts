import { Component, Input, OnInit } from '@angular/core';
import { UserData, SubsCriptions } from 'src/app/models/interface';
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

  addNewsubCription(userSearch: UserData): void{
    if(this.subscriptions === null){
      this.subscriptions = this.addSubcriptions(userSearch);
    }else{
      this.updateSubscriptions(userSearch);
    }
    userSearch.subscribe = true;
    userSearch.subsCriptions += 1;
    this.db.updateUserSubscription(userSearch.uid, 1);
    this.store.setItemStore('subscribed', JSON.stringify(this.subscriptions));
  }

  addSubcriptions(user: UserData): SubsCriptions{
    const subCription: SubsCriptions = {
      uid: this.sessions.user.uid,
      subsCriptions: [{
        uid: user.uid,
        date: new Date()
      }]
    };
    this.db.addSubcriptions(subCription);
    return subCription;
  }

  removeSubscription(user: UserData): void{
    this.subscriptions.subsCriptions = this.subscriptions.subsCriptions.filter(sub => sub.uid !== user.uid);
    this.store.setItemStore('subscribed', JSON.stringify(this.subscriptions));
    this.db.updateSubscriptions(this.subscriptions);
    user.subsCriptions -= 1;
    this.db.updateUserSubscription(user.uid, -1);
    user.subscribe = undefined;
  }

  updateSubscriptions(user: UserData): void{
    this.subscriptions.subsCriptions.push({
      uid: user.uid,
      date: new Date()
    });
    this.db.updateSubscriptions(this.subscriptions);
  }

}
