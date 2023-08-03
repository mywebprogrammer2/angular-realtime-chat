import { Component,ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/authService.service';
import { User } from 'src/app/dashboard/models/user.model';
import { ChatService } from '../../services/chat.service';
import { Subscription } from 'rxjs';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-chats-modals',
  templateUrl: './modals.component.html',
  styleUrls: ['./modals.component.css']
})
export class ModalsComponent {

  @ViewChild('imageModal',{ static: true}) imageModal: ElementRef<HTMLElement> ;
  @ViewChild('settings',{ static: true}) settingsModal: ElementRef<HTMLElement> ;
  @ViewChild('fileInput', { static: true }) fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('settingForm', { static: true }) settingForm: NgForm;


  attachmentPreview: string | null = null;
  attachmentFileName: string | null = null;
  auhSubscription: Subscription;
  previewImage:string | null = "";
  error: string = "";

  colors= [
    '#2180f3',
    '#2196F3',
    '#00BCD4',
    '#3F51B5',
    '#673AB7',
    '#4CAF50',
    '#FFC107',
    '#FF9800',
    '#ff2522',
    '#9C27B0',
  ]

  authUser?: User;
  messengerColor ='#2180f3';
  selectedColor='';

  constructor(private authService: AuthService,private chatService:ChatService, private storageService:StorageService){
    this.authUser = authService.getUser() as User;
    this.messengerColor =this.authUser.messenger_color ?? '#2180f3';
    this.messengerColor = this.selectedColor

  }

  ngOnInit(){
    this.subscribeAuthUser();
  }

  subscribeAuthUser(){
    this.auhSubscription = this.authService.AuthUser.subscribe(x=>{
      this.authUser=x;
    })
  }

  openImage(fileUrl : string | null = ""){
    this.imageModal.nativeElement.style.display = "block";
    this.previewImage = fileUrl;
  }

  closeImageModel(){
    this.imageModal.nativeElement.style.display = "none";
    this.previewImage = "";
  }

  openSettings(){
    this.settingsModal.nativeElement.style.display = "block";
  }

  closeSettings(){
    this.attachmentPreview= null;
    this.attachmentFileName= null;
    this.fileInput.nativeElement.value= '';
    this.settingsModal.nativeElement.style.display = "none";
  }

  setPrimaryColor(color : string){
    this.selectedColor = color
  }

  updateSettings(){

    this.error = "";
    const files: FileList | File[] | null = this.fileInput.nativeElement.files;

    this.chatService.updateSettings(files as unknown as File[],{messengerColor: this.selectedColor}).subscribe({
      next: (response:any)=>{
        if(response.user)
          this.storageService.write('user', response.user as User)
          this.authService.getUser();
          this.closeSettings();
      },
      error: (error:any) =>{
          this.error = error.message ?? 'An error occurred while saving the settings. Please try again later.';
      }
    })

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

  escapeHtml = (unsafe:String) => {
    return unsafe
      .replaceAll(/&/g, "&amp;")
      .replaceAll(/</g, "&lt;")
      .replaceAll(/>/g, "&gt;");
  };

  ngOnDestroy(){
    if(this.auhSubscription) this.auhSubscription.unsubscribe();
  }
}
