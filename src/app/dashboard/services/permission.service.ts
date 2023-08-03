import { Injectable } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { User } from '../models/user.model';
import { AuthService } from 'src/app/auth/services/authService.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private authService:AuthService) { }


  hasPermission(requiredPermission: string, user?: User | null): boolean {
    user = user ? user : this.authService.getUser();
    if(user && user.all_permissions){
      const hasPermission = user.all_permissions.some(permission => permission.name === requiredPermission);
      if (hasPermission) {
        return true;
      }
    }

    return false;
  }
}
