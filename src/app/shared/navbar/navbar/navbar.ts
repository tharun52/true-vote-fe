import { Component } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { RouterLink } from '@angular/router';
import { VoterDetail } from "../../../voter/voter-detail/voter-detail";

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, VoterDetail],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  showPopup = false;
  selectedEmail: string | null = null;

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

  openVoterDetail(email: string, event: Event): void {
    event.preventDefault();
    this.selectedEmail = email;
    this.showPopup = true;
  }
}
