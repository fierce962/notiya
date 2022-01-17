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

  constructor(private sessions: SessionsService,
    private store: StorageService,
    private db: DatabaseService) { }

  ngOnInit() {}

  hasStoreSubCription(userSearch: UserData): void{
    let subscriptions: SubsCriptions | null = JSON.parse(this.store.getItemStore('subscribed'));
    if(subscriptions === null){
      subscriptions = this.addSubcriptions(userSearch);
    }else{
      subscriptions.subsCriptions.push(userSearch.uid);
      this.db.updateSubscriptions(subscriptions);
    }
    this.store.setItemStore('subscribed', JSON.stringify(subscriptions));
  }

  addSubcriptions(user: UserData): SubsCriptions{
    const subCription: SubsCriptions = {
      uid: this.sessions.user.uid,
      subsCriptions: [user.uid]
    };
    this.db.addSubcriptions(subCription);
    return subCription;
  }
}
