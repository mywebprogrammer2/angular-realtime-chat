import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { User } from 'src/app/dashboard/models/user.model';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Message, MessageClass } from '../../models/message.model';
import { ContactsService } from '../../services/contacts.service';

@Component({
  selector: 'app-chats-send-form',
  templateUrl: './send-form.component.html',
  styleUrls: ['./send-form.component.css']
})
export class SendFormComponent implements OnInit, OnDestroy {

  allowedImages= ['png','jpg','jpeg','gif'];
  @ViewChild('fileInput', { static: true }) fileInput!: ElementRef<HTMLInputElement>;
  allowedFiles= ['zip','rar','txt'];
  user: User | null;
  getUserSubscription: Subscription;
  sendSubscription: Subscription;
  @ViewChild('form', {static:true}) form : NgForm;
  typingTimeout: any;
  attachmentPreview: string | null = null;
  attachmentFileName: string | null = null;
  requesting= false;
  errorMessage: string | null = null;

  constructor(private chatService: ChatService, private contactService: ContactsService) {

  }

  ngOnInit(): void {
    this.getUser()
  }

  getUser(){
    this.getUserSubscription= this.chatService.messengerUserEmitter.subscribe(user =>{
      this.user = user
    })
  }

  emitTyping(){
    // this.chatService.typingEmitter.emit(true)
    clearTimeout(this.typingTimeout);

    // Set a new timeout of 500ms
    this.typingTimeout = setTimeout(() => {
      // Emit false to indicate that the user has stopped typing
      this.chatService.isTyping(false)
    }, 500);

    // Emit true to indicate that the user is typing
    this.chatService.isTyping(true)
  }

  onAttachmentChange(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) return;

    if (!this.attachmentValidate(file)) return;

    const reader = new FileReader();
    reader.addEventListener('loadstart', () => {
      // Add your loading indicator logic here
    });
    reader.addEventListener('load', () => {
      // Remove the loading indicator and update the attachment preview
      this.attachmentPreview = reader.result as string;
    });
    reader.readAsDataURL(file);

    this.attachmentFileName = this.escapeHtml( file.name); // Set the attachment file name
  }

  attachmentValidate(file: File): boolean {
    // Implement your attachment validation logic here
    return true;
  }

  getAttachmentFileName(): string {
    if (!this.attachmentPreview) return '';

    // Extract the file name from the attachment preview URL
    const startIndex = this.attachmentPreview.lastIndexOf('/') + 1;
    const endIndex = this.attachmentPreview.lastIndexOf('.');
    return this.attachmentPreview.substring(startIndex, endIndex);
  }

  isImageAttachment(): boolean {
    if (!this.attachmentPreview) return false;

    // Check if the attachment preview URL starts with "data:image/"
    return this.attachmentPreview.startsWith('data:image/');
  }

  cancelAttachment() {
    this.attachmentPreview = null;
    this.attachmentFileName = null;
    this.fileInput.nativeElement.value = '';
  }

  escapeHtml = (unsafe:String) => {
    return unsafe
      .replaceAll(/&/g, "&amp;")
      .replaceAll(/</g, "&lt;")
      .replaceAll(/>/g, "&gt;");
  };

  sendMessage(){
    this.errorMessage= null;
    const files: FileList | File[] | null = this.fileInput.nativeElement.files;

    if(files?.length == 0 && String( this.form.value?.message ?? '').trim() == ''){
      return;
    }
    this.requesting= true
    this.chatService.sendMessage(files as unknown as File[],this.form.value).subscribe({
      next: (response:any) => {
        this.cancelAttachment();
        if(response.message){
          let message=new MessageClass(
            response.message.id,
            response.message.from_id,
            response.message.to_id,
            response.message.message,
            response.message.attachment,
            response.message.timeAgo,
            response.message.created_at,
            response.message.isSender,
            response.message.seen
            ) ;
          message.seen = false;
          let m = this.chatService.messages;
          m.push(message)
          this.chatService.getMessageEmitter.next(m)
          this.form.resetForm();
          this.chatService.sendContactItemUpdates(true);
          this.contactService.updateContactItem(this.chatService.messengerId,0,0)
          this.contactService.updateLastMessage(message.to_id,message)
        }
        this.requesting= false
      },
      error: (error)=>{
        this.requesting= false
        this.errorMessage = error.message ?? null
      },
      complete: () => {
        this.requesting= false
      }
    })
  }
  ngOnDestroy(){
    this.getUserSubscription.unsubscribe()
  }
}
