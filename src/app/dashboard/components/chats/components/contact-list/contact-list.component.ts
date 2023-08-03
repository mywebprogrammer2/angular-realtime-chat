import { Component, OnInit,OnDestroy, Input } from '@angular/core';
import { User } from 'src/app/dashboard/models/user.model';
import { ContactsService } from '../../services/contacts.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/authService.service';
import { DeleteConfirmationDialogComponent } from 'src/app/dashboard/shared/components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit,OnDestroy{
  lastMessage:any;
  unseenCounter:number = 0;
  lastMessageBody:any;
  subscription:Subscription;
  auhSubscription: Subscription;
  deleteSubscription:Subscription;
  contacts:User[] = [];
  authUser: User | null ;
  image:string= '';
  @Input() showSearchResults:boolean = false;

  constructor(private contactsService:ContactsService, private authService:AuthService,public dialog: MatDialog, private chatService:ChatService){
    this.authUser = this.authService.getUser();

  }

  ngOnInit(){
    if(!this.showSearchResults){
      this.contactsService.fetchData();
    }
    this.loadContacts();
    this.subscribeAuthUser();
  }

  subscribeAuthUser(){
    this.auhSubscription = this.authService.AuthUser.subscribe(x=>{
      this.authUser=x;
    })
  }

  loadContacts(){
    if(this.showSearchResults){
      this.subscription =  this.contactsService.getSearchResults().subscribe((x)=>{
        this.contacts = x;
      })
    }
    else{

      this.subscription =  this.contactsService.getData.subscribe((x)=>{
        this.contacts = x;
      })
    }
  }



  openDeleteConfirmationDialog(id:number): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteUser(id)
      }
    });
  }

  deleteUser(id:number){
    this.deleteSubscription = this.contactsService.delete(id).subscribe({
      next: () => this.onDeleted(id),
      error: (error) => {},
      complete: () => {}

    })
  }

  onDeleted(id:number): void {
    const deleteItem = this.contacts.find(x => x.id == id);
    if(deleteItem){
      this.contactsService.deleteLocally( deleteItem );
    }
  }

  getChats(user:User): void {
    this.chatService.setUser(user);
  }



  ngOnDestroy(): void {
      this.subscription.unsubscribe();
    if(this.auhSubscription) this.auhSubscription.unsubscribe();

  }
}
