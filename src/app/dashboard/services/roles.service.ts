import { Injectable, OnDestroy } from '@angular/core';
import { Role } from '../models/role.model';
import { BaseService } from 'src/app/services/base.service';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService extends BaseService<Role> implements OnDestroy {

  subscription: Subscription;

  constructor(protected http: HttpClient) {
    super();
  }

  protected getEndpoint(): string {
    return 'roles'; // Provide the endpoint URL for roles
  }

  fetchData(){
    this.getAll().subscribe(data=>{
      this.data = data;
      this.getData.next(this.data);
    })
  }

  fetchPermissions(){
    return this.get<any>('roles/permissions')
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
