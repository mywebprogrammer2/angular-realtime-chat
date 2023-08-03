import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseService } from 'src/app/services/base.service';
import { Auth } from '../models/auth.model';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { User } from 'src/app/dashboard/models/user.model';
import { Role } from 'src/app/dashboard/models/role.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService<Auth> {

  public AuthUser: BehaviorSubject<User| any> = new BehaviorSubject(null);

  constructor(protected http: HttpClient,private storage: StorageService,private router: Router) {
    super();
  }



  protected getEndpoint(): string {
    return 'auth'; // Provide the endpoint URL for users
  }

  login(credentials: { email: string; password: string }){
    return this.post<{ token: string }>(this.getEndpoint()+ '/login',credentials)
  }
  register(credentials: { name:string,email: string; password: string,password_confirmation: string }){
    return this.post<{ token: string }>(this.getEndpoint()+ '/register',credentials)
  }

  logout() {
    this.post<any>('auth/logout', {}).subscribe({
      next: (res) => {
        this.storage.clear();
        this.router.navigate(["/"]);
      }
    });
  }

  forgotPassword(body:any){
    return this.post<any>('auth/forgot-password',body);
  }

  resetPassword(body:any){
    return this.post<any>('auth/reset-password',body);
  }

  changePassword(body:any){
    return this.post<any>('auth/change-password',body);
  }

  getUser(){
    this.AuthUser.next(this.storage.read<User>('user'));
    return this.storage.read<User>('user');
  }

  hasRole(roleName: string, user?: User | null): boolean {
    if (!user) {
      user = this.getUser();
    }

    if (user && user.roles) {
      return user.roles.some((role: Role) => role.name === roleName);
    }

    return false;
  }
}
