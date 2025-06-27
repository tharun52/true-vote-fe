import { Component, Input, OnInit } from '@angular/core';
import { PollService } from '../poll.service';

@Component({
  selector: 'app-poll-card',
  imports: [],
  templateUrl: './poll-card.html',
  styleUrl: './poll-card.css'
})
export class PollCard implements OnInit {
  @Input() poll: any;

  isImageFile: boolean = false;
  hasFileType: boolean = false; // controls when to render at all

  constructor(private pollService: PollService) {}

  ngOnInit(): void {
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

}