import { Component } from '@angular/core';
import { ModeratorModel } from '../../models/ModeratorModel';
import { AuthService } from '../../auth/auth.service';
import { PollsList } from "../../polls/polls-list/polls-list";
import { RouterLink } from '@angular/router';
import { ModeratorService } from '../moderator.service';
import { ModeratorEmails } from '../moderator-emails/moderator-emails';

@Component({
  selector: 'app-moderator-dashboard',
  imports: [PollsList, RouterLink, ModeratorEmails],
  templateUrl: './moderator-dashboard.html',
  styleUrl: './moderator-dashboard.css'
})
export class ModeratorDashboard {
  moderator: ModeratorModel | null = null;
  stats: any;

  constructor(private authService: AuthService, private moderatorService: ModeratorService) {
    const user = this.authService.getCurrentUser();
    if (user && user.role === 'Moderator') {
      const email = user.username;

      this.moderatorService.getModeratorByEmail(email).subscribe({
        next: (moderatorData: ModeratorModel) => {
          this.moderator = moderatorData;
          this.getModeratorStats(moderatorData.id);
        },
        error: (err) => {
          console.error('Error fetching moderator info', err);
        }
      });
    }
  }

  getModeratorStats(moderatorId: string) {
    this.moderatorService.getStats(moderatorId).subscribe({
      next: (data) => {
        this.stats = {
          totalPollsCreated: 0,
          totalVoterEmailsCreated: 0,
          totalVoterEmailsUsed: 0,
          totalVotesReceived: 0
        };

        this.animateCount('totalPollsCreated', data.totalPollsCreated);
        this.animateCount('totalVoterEmailsCreated', data.totalVoterEmailsCreated);
        this.animateCount('totalVoterEmailsUsed', data.totalVoterEmailsUsed);
        this.animateCount('totalVotesReceived', data.totalVotesReceived);
      },
      error: (err) => {
        console.error('Error fetching stats', err);
      }
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
}