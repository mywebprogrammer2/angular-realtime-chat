import { Component, Input } from '@angular/core';
import { User } from 'src/app/dashboard/models/user.model';

@Component({
  selector: 'app-chats-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css']
})
export class ListItemComponent {

  lastMessage:any;
  unseenCounter:number = 0;
  lastMessageBody:any;
  user?: User | any;
  authUser?: User ;
  @Input() get:string = 'saved';
  image:string= '';

  constructor(){
    this.lastMessageBody = this.lastMessage?.body
    this.lastMessageBody = this.lastMessageBody?.length > 30 ? this.lastMessageBody?.substring(0, 30) + '..' : this.lastMessageBody;
  }


}
