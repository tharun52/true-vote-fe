import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRole = route.data?.['expectedRole'];
  const isLoggedIn = authService.isLoggedIn();

  if(!isLoggedIn)
    return router.createUrlTree(['/']);
  
  const userRole = authService.getRole();

  if(expectedRole&& userRole!= expectedRole)
    return router.createUrlTree([`${userRole?.toLocaleLowerCase()}`]);
  
  return true;
};
