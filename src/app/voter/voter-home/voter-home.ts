import { Component, OnInit } from '@angular/core';
import { PollsList } from "../../polls/polls-list/polls-list";
import { AuthService } from '../../auth/auth.service';
import { VoterService } from '../voter.service';
import { VoterModel } from '../../models/VoterModel';
import { ModeratorsList } from "../../moderator/moderators-list/moderators-list";
import { MessageInbox } from "../../message/message-inbox/message-inbox";
import { MessageService } from '../../message/message.service';
import { MessageModel } from '../../models/MessageModel';

@Component({
  selector: 'app-voter-home',
  imports: [PollsList, ModeratorsList, MessageInbox],
  templateUrl: './voter-home.html',
  styleUrl: './voter-home.css'
})
export class VoterHome{
  voter: VoterModel | null = null;
  stats: any;
  loading = true;
  messages: MessageModel[] = [];

  constructor(private authService: AuthService, 
              private voterService: VoterService,
              private messageService: MessageService
    ) {
    const user = this.authService.getCurrentUser();
    console.log(user);
    if (user && user.role === 'Voter') {
      const email = user.username;

      this.voterService.getVoterByEmail(email).subscribe({
        next: (voterData: VoterModel) => {
          this.voter = voterData;
          this.getVoterStats(voterData.id);
        },
        error: (err) => {
          console.error('Error fetching voter info', err);
          this.loading = false;
        }
      });

      this.messageService.getMessages().subscribe((msgs) => {
        this.messages = msgs;
      });
    }
  }

  getVoterStats(voterId: string) {
    this.voterService.getStats(voterId).subscribe({
      next: (data) => {
        this.stats = {
          totalOnGoingPolls: 0,
          totalPollsVoted: 0
        };

        this.animateCount('totalOnGoingPolls', data.totalOnGoingPolls);
        this.animateCount('totalPollsVoted', data.totalPollsVoted);
        this.loading = false;

      },
      error: (err) => console.error('Error fetching voter stats', err)
      
    });
  }

  animateCount(key: keyof typeof this.stats, target: number) {
    const duration = 800;
    const frameRate = 30;
    const totalFrames = Math.round(duration / (1000 / frameRate));
    let frame = 0;

    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      this.stats[key] = Math.floor(target * progress);
      if (frame >= totalFrames) {
        this.stats[key] = target;
        clearInterval(interval);
      }
    }, 1000 / frameRate);
  }

  hasMessages(): boolean {
    return this.messages.length > 0;
  }
}