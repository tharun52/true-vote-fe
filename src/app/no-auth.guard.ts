import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Injectable({ providedIn: 'root' })
export class NoAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      const role = this.authService.getRole(); 

      switch (role) {
        case 'Admin':
          this.router.navigate(['/admin']);
          break;
        case 'Voter':
          this.router.navigate(['/voter']);
          break;
        case 'Moderator':
          this.router.navigate(['/moderator']);
          break;
        default:
          this.router.navigate(['/']);
      }
      return false;
    }
    return true;
  }
}
