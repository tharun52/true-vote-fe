import { Component, Input } from '@angular/core';
import { PollService } from '../poll.service';

@Component({
  selector: 'app-poll-card',
  imports: [],
  templateUrl: './poll-card.html',
  styleUrl: './poll-card.css'
})
export class PollCard {
  @Input() poll: any;
  constructor(private pollService:PollService){
  }
  getFileUrl(): string {
    return this.pollService.getPollFileUrl(this.poll?.poleFileId);
  }
  isImage(): boolean {
    const fileId = this.poll.poleFileId.toLowerCase();
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => fileId.endsWith(ext));
  }
}
