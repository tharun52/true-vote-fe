import { Component, Input, OnInit } from '@angular/core';
import { PollService } from '../poll.service';
import { AuthService } from '../../auth/auth.service';
import { EditPoll } from '../edit-poll/edit-poll';
import { DatePipe, NgClass } from '@angular/common';
import { ToastService } from '../../shared/ToastService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-poll-card',
  imports: [DatePipe, EditPoll, NgClass],
  templateUrl: './poll-card.html',
  styleUrl: './poll-card.css',
})
export class PollCard implements OnInit {
  @Input() poll: any;
  @Input() voteTime?: string | null;
  @Input() ForVoting: boolean = false;

  
  loggedInEmail:string | undefined = undefined;

  // selectedModeratorEmail: string | null = null;
  // showModeratorPopup = false;

  selectedOptionId: string | null = null;
  voting: boolean = false;
  voted: boolean = false;

  showEdit = false;

  isCompleted: boolean = false;

  isImageFile: boolean = false;
  hasFileType: boolean = false;

  constructor(private pollService: PollService, private authService:AuthService, private toastService:ToastService, private router:Router) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.loggedInEmail = user?.username;
    if (this.poll?.poleFileId) {
      this.pollService.getFileMetadata(this.poll.poleFileId).subscribe({
        next: (type: string) => {
          this.hasFileType = true;
          this.isImageFile = type.startsWith('image/');
        },
        error: (err) => {
          console.error('Error fetching content type:', err);
          this.hasFileType = true;
          this.isImageFile = false;
        }
      });
    }
    if (this.poll?.endDate) {
      const now = new Date();
      const end = new Date(this.poll.endDate);
      this.isCompleted = end < now;
    }
  }

  getFileUrl(): string {
    return this.pollService.getPollFileUrl(this.poll?.poleFileId);
  }

  downloadFile(event: Event) {
    event.preventDefault();
    const link = document.createElement('a');
    link.href = this.getFileUrl();
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  handlePollUpdate(updatedPoll: any) {
    this.poll = updatedPoll;
    this.showEdit = false;
  }
  submitVote(): void {
  if (!this.selectedOptionId) return;

  this.voting = true;

  this.pollService.vote(this.selectedOptionId).subscribe({
      next: () => {
        this.voted = true;
        this.voting = false;
        this.voteTime = new Date().toISOString();
        this.toastService.show("Voted", "Your Voter has been registered successfully", false);
        this.router.navigateByUrl('/voter');
      },
      error: (err) => {
        this.voting = false;
        alert('Failed to submit vote. Try again.');
        console.error('Vote error:', err);
      }
    });
  }

  isModerator(){
    return this.authService.getRole() == 'Moderator';
  }

  // openModeratorDetail(email: string): void {
  //   this.selectedModeratorEmail = email;
  //   this.showModeratorPopup = true;
  // }
  // isAdmin(){
  //   return this.authService.getRole() == 'Admin';
  // }
  // onModeratorDetailClosed(): void {
  //   this.showModeratorPopup = false;
  // }
}