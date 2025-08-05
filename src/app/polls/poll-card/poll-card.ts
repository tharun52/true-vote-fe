import { Component, Input, OnInit } from '@angular/core';
import { PollService } from '../poll.service';
import { AuthService } from '../../auth/auth.service';
import { EditPoll } from '../edit-poll/edit-poll';
import { DatePipe, NgClass } from '@angular/common';
import { ToastService } from '../../shared/ToastService';

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

  deleteLoading = false;
  

  isCompleted: boolean = false;

  isImageFile: boolean = false;
  hasFileType: boolean = false;

  constructor(private pollService: PollService, private authService:AuthService, private toastService:ToastService) {}

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
        window.location.reload();
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
  
  canEditPoll(): boolean {
    if (!this.isModerator() || this.poll?.createdByEmail !== this.loggedInEmail || this.isCompleted) {
      return false;
    }

    const options = this.poll?.pollOptions?.$values || [];
    return options.every((opt: any) => opt.voteCount === 0);
  }
  
  deletePoll() {
    const confirmation = prompt(
      'To confirm deletion, please type DELETE (in uppercase):'
    );

    if (confirmation !== 'DELETE') {
      return;
    }

    this.deleteLoading = true;

    this.pollService.deletePoll(this.poll.id).subscribe({
      next: () => {
        this.toastService.show('Poll Deleted', 'The poll was successfully deleted.', false);
        window.location.reload();
      },
      error: (err) => {
        this.deleteLoading = false;
      },
      complete: () => {
        this.deleteLoading = false;
      }
    });
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