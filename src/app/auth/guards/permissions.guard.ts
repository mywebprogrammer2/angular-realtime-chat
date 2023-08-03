import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/dashboard/models/user.model';
import { StorageService } from 'src/app/services/storage.service';


export const PermissionsGuard : CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const storageService = inject(StorageService);
  const router = inject(Router);

  const user = storageService.read<User>('user');



  if (user && user.all_permissions) {
    // Get the permission name from the route data
    const requiredPermission = route.data['permission'];

    // Check if the user has the required permission
    const hasPermission = user.all_permissions.some(permission => permission.name === requiredPermission);

    if (hasPermission) {
      // User has the required permission, allow access
      return true;
    } else {
      // User does not have the required permission, redirect to unauthorized page or show an error message
      // For example, redirect to a route named 'unauthorized'
      router.navigate(['/']);
      return false;
    }
  }


  router.navigate(['/']);
  return false;
};

