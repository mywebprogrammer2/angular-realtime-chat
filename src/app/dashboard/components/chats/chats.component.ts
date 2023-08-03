import { OnDestroy, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { AuthService } from 'src/app/auth/services/authService.service';
import { environment } from 'src/environments/environment';
import { User } from '../../models/user.model';
import { Subscription } from 'rxjs';
import { ChatService } from './services/chat.service';
import { Message } from './models/message.model';
import { ModalsComponent } from './components/modals/modals.component';
import { ContactsService } from './services/contacts.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';

declare const window:any;
declare const $:any;

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ChatsComponent implements OnInit, OnDestroy {

  id: number = 0;
  chat_app_name: string;
  authUser?: User | null
  user?: User | null
  messages: Message[]= [];
  typing: boolean = false;
  search: string= '';
  isSearching: boolean = false;

  @ViewChild(ModalsComponent, { static: true }) modalsComponent : ModalsComponent;
  @ViewChild('mBody', { static: true }) mBody : ElementRef;
  messagesSubscription: Subscription;
  messageUserSubscription: Subscription;
  typingSubscription: Subscription;
  auhSubscription: Subscription;

  constructor(private authService: AuthService,private chatService: ChatService, private contactService: ContactsService, public dialog: MatDialog){

    this.authUser = authService.getUser();
    this.chatService.initializeServer();
  }

  ngOnInit(): void {
    this.loadMessages();
    this.monitorTyping()
    this.messageUser();
    this.subscribeAuthUser();
  }

  subscribeAuthUser(){
    this.auhSubscription = this.authService.AuthUser.subscribe(x=>{
      this.authUser=x;
      this.changePrimaryColor();
    })
  }

  loadMessages(){
    this.messagesSubscription = this.chatService.getMessageEmitter.subscribe(messages => {
      this.messages = messages;
      setTimeout(() =>{
        this.ScrollBottom(this.mBody.nativeElement,this.id != this.chatService.messengerId)
        this.id=this.chatService.messengerId;
      },100 );
    })
  }

  monitorTyping(){
    this.typingSubscription = this.chatService.typingEmitter.subscribe(typing => {
      this.typing = typing;
      this.ScrollBottom(this.mBody.nativeElement);

    })
  }

  messageUser(){
    this.messageUserSubscription= this.chatService.messengerUserEmitter.subscribe(user => {this.user = user})
  }

  ScrollBottom(elementRef: HTMLDivElement,fullScroll: boolean = false): void {
    const container = elementRef;
    if (fullScroll) {
      container.scrollTop = container.scrollHeight;
    } else {
      // Determine if the user is near the bottom
      const nearBottom = container.scrollHeight - container.scrollTop - container.clientHeight <= 200;
      if (nearBottom) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }

  openImage(event: string| null){
    this.modalsComponent.openImage(event);
  }

  changePrimaryColor(){
    document.documentElement.style.setProperty('--primary-color',this.authUser?.messenger_color ?? this.modalsComponent.colors[0])
  }

  onSearchFocus(){
    this.isSearching = true;
  }

  onBlurFocus(){
    if(this.search.length > 0){
      this.isSearching = true;
    }
    else{
      this.isSearching = false;
    }
  }

  onSearchChange(){
    this.contactService.searchByName(this.search);
  }


  closeChat(){
    this.chatService.setUser(null)
  }

  openDeleteConfirmationDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: "Delete Conversation",
        message: "Are you sure you want to delete this Conversation?"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteConversation()
      }
    });
  }


  deleteConversation(){
    this.chatService.deleteConversation().subscribe({
      next: (response: any) => {
        this.chatService.deleteConversationLocally();
        this.chatService.sendDeleteConversationEvent();
      },
      error: (error) => {
        console.log("🚀 ~ error:", error)
      },
    })
  }

  ngOnDestroy() {
    if(this.messagesSubscription) this.messagesSubscription.unsubscribe();
    if(this.typingSubscription) this.typingSubscription.unsubscribe();
    if(this.messageUserSubscription) this.messageUserSubscription.unsubscribe();
    if(this.auhSubscription) this.auhSubscription.unsubscribe();
    this.chatService.destroy();
  }

}
