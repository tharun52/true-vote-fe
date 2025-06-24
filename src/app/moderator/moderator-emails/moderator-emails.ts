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
  constructor(private moderatorService:ModeratorService) {}

  openVoterDetail(email: string, event: Event): void {
    event.preventDefault();
    this.selectedEmail = email;
    this.showPopup = true;
  }

  ngOnInit(): void {
    this.moderatorService.getModeratorEmails().subscribe(data => this.emails = data);
  }
}
