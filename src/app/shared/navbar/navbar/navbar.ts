import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { RouterLink } from '@angular/router';
import { VoterDetail } from "../../../voter/voter-detail/voter-detail";
import { ThemeService } from '../../ThemeService';
import { ModeratorDetail } from "../../../moderator/moderator-detail/moderator-detail";
import { MessageService } from '../../../message/message.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, VoterDetail, ModeratorDetail],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})

export class Navbar implements OnInit{
  showPopup = false;
  selectedEmail: string | null = null;
  isMenuOpen = false;
  hasMessages: boolean = false;

  showModeratorPopup = false;
  selectedModeratorEmail: string | null = null;

  constructor(public authService: AuthService, 
              private themeService:ThemeService,
              private messageService:MessageService
        ) {}
        
  ngOnInit(): void {
    this.messageService.getMessages().subscribe(messages => {
      this.hasMessages = messages.length > 0;
    });
  }

  logout() {
    this.authService.logout();
  }

  get isAdmin(): boolean {
    return this.authService.getRole()?.toLowerCase() === 'admin';
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

  openModeratorDetail(email: string, event: Event): void {
    event.preventDefault();
    this.selectedModeratorEmail = email;
    this.showModeratorPopup = true;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
  closeMenu(): void {
    this.isMenuOpen = false;
  }

}