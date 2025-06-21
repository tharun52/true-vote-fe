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
    return this.authService.getCurrentUser()?.role === 'Moderator';
  }

  get moderatorName(): string | null {
    return this.authService.getCurrentUser()?.username || null;
  }
}
