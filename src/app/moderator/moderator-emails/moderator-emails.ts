import { Component } from '@angular/core';
import { VoterEmailModel } from '../../models/VoterEmailModel';
import { ModeratorService } from '../moderator.service';
import { DatePipe } from '@angular/common';
import { VoterDetail } from "../../voter/voter-detail/voter-detail";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-moderator-emails',
  imports: [DatePipe, VoterDetail, RouterLink],
  templateUrl: './moderator-emails.html',
  styleUrl: './moderator-emails.css'
})
export class ModeratorEmails {
  emails: VoterEmailModel[] = [];
  showPopup = false;
  selectedEmail: string | null = null;

  hasError = false;

  constructor(private moderatorService: ModeratorService) {}

  ngOnInit(): void {
    this.fetchEmails();
  }

  fetchEmails(): void {
    this.hasError = false;

    this.moderatorService.getModeratorEmails().subscribe({
      next: (data) => {
        this.emails = data;
      },
      error: (err) => {
        console.error('Failed to load emails:', err);
        this.hasError = true;
      }
    });
  }

  openVoterDetail(email: string, event: Event): void {
    event.preventDefault();
    this.selectedEmail = email;
    this.showPopup = true;
  }
}
