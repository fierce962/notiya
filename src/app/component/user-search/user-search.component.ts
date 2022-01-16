import { Component, Input, OnInit } from '@angular/core';
import { UserData } from 'src/app/models/interface';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss'],
})
export class UserSearchComponent implements OnInit {
  @Input() users: UserData[];

  constructor() { }

  ngOnInit() {}

}
