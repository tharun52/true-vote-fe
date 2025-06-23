import { Component } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }

  get isModerator(): boolean {
    return this.authService.getRole()?.toLowerCase() === 'moderator';
  }

  get isVoter(): boolean {
    return this.authService.getRole()?.toLowerCase() === 'voter';
  }

  get userName(): string {
    return this.authService.getUsername() || '';
  }
}