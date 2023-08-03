import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { inject } from "@angular/core";
import { StorageService } from "src/app/services/storage.service";

export const authGuard : CanActivateFn = () => {
  const storageService = inject(StorageService);
  const router = inject(Router);

  var token = storageService.read('access_token');

  if(token) {
    return true
  }

  return router.parseUrl('/');
};



export const canActivateChild: CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => authGuard(route, state);
