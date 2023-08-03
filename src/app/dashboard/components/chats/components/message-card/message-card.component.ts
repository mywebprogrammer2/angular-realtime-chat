import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { Message, MessageClass } from '../../models/message.model';
import { environment } from 'src/environments/environment';
import { ChatService } from '../../services/chat.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/dashboard/shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-message-card',
  templateUrl: './message-card.component.html',
  styleUrls: ['./message-card.component.css'],
})
export class MessageCardComponent implements OnInit, OnDestroy{
  @Input() message: MessageClass;
  @Output() openImage: EventEmitter<string| null> = new EventEmitter();
  makeSeenSubscription: Subscription;
  deleteSubscription: Subscription;

  attachment_download_url= '';
  constructor(
    private chatService: ChatService,
    private cd : ChangeDetectorRef,
    public dialog: MatDialog
    ){
    this.attachment_download_url= environment.attachment_download_url
  }

  ngOnInit(){
    this.makeSeenSubscription= this.chatService.makeSeenEmitter.subscribe((b)=>{

      this.message.seen = b;


      this.cd.detectChanges();
    })
  }

  openDeleteConfirmationDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: "Delete Message",
        message: "Are you sure you want to delete this message?"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteMessage()
      }
    });
  }

  deleteMessage(): void{
    this.deleteSubscription = this.chatService.post('chatify/deleteMessage',{id:this.message.id}).subscribe({
      next: () => this.onDeleted(),
      error: (error) => {},
      complete: () => {}

    })
  }

  onDeleted(): void {
    const deleteItem = this.chatService.messages.find(x => x.id == this.message.id);
    if(deleteItem){
      this.chatService.deleteLocally( deleteItem );
    }
  }





  ngOnDestroy(){
    if(this.makeSeenSubscription) this.makeSeenSubscription.unsubscribe();
    if(this.deleteSubscription) this.deleteSubscription.unsubscribe();
  }
}
