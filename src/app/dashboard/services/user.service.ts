import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { User } from '../models/user.model';
import { BaseService } from 'src/app/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<User> {

  constructor(protected http: HttpClient) {
    super();
  }



  protected getEndpoint(): string {
    return 'users'; // Provide the endpoint URL for users
  }

  fetchData(){
    this.getAll().subscribe(users=>{
      this.data = users;
      this.getData.next(this.data);
    })
  }

  activate(id:number){
    return this.post<User>('user/activate/'+id,{});
  }

  deactivate(id:number){
    return this.post<User>('user/deactivate/'+id,{});
  }

}
