import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/dashboard/models/user.model';
import { BaseService } from 'src/app/services/base.service';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class ContactsService extends BaseService<User> {

  private searchResults: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

  constructor(protected http: HttpClient) {
    super();
  }

  protected getEndpoint(): string {
    return 'chatify/getContacts'; // Provide the endpoint URL for roles
  }

  fetchData(){
    this.getAll().subscribe(users=>{
      this.data = users;
      this.getData.next(this.data);
    })
  }

  searchByName(name: string) {
    name = name.toLowerCase(); // Convert search query and names to lowercase for case-insensitive search
    const results = name== ''? []: this.data.filter(user => user.name.toLowerCase().includes(name));
    this.searchResults.next(results);
  }

  getSearchResults() {
    return this.searchResults.asObservable();
  }


  /**
   *-------------------------------------------------------------
   * Update contact item
   *-------------------------------------------------------------
   */
   updateContactItem(user_id: number, messengerId: number, auth_id: number) {
     if (user_id != auth_id) {
      let index =   this.data.findIndex(x=>x.id == user_id);
      if(index > -1){
        this.post('chatify/getContact',{id: user_id}).subscribe({
          next: (data: any)=> {
            this.data.splice(index,1);
            this.data.unshift(data);
          }
        })
      }
      if (user_id == messengerId){
        this.updateSelectedContact(user_id,messengerId);

      }
    }
  }

  setActive(user_id: number, status: boolean){
    let contact = this.data.find(x=>x.id == user_id)
    if(contact){
      contact.active_status = status;
      this.updateLocally(contact,(x)=>x.id );
    }
  }

  setSeen(user_id: number){
    let contact = this.data.find(x=>x.id == user_id)
    if(contact){
      contact.unseen = 0;
      this.updateLocally(contact,(x)=>x.id );
    }
  }

  updateLastMessage(user_id:number, message:  Message){
    let index =   this.data.findIndex(x=>x.id == user_id);
    if(index > -1){
      let data = this.data[index];
      data.last_message = message;
      this.data.splice(index,1,data);
      this.getData.next(this.data);
    }
  }

  updateSelectedContact(user_id: number,  messengerId: number) {
    // $(document).find('.messenger-list-item').removeClass('m-list-active');
    // $(document)
    //   .find(
    //     '.messenger-list-item[data-contact=' +
    //       (user_id ||  messengerId) +
    //       ']'
    //   )
    //   .addClass('m-list-active');
  }

}
