import { Component } from '@angular/core';
import { ModeratorsList } from "../../moderator/moderators-list/moderators-list";
import { PollsList } from "../../polls/polls-list/polls-list";
import { AuthService } from '../../auth/auth.service';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-adim-home',
  imports: [ModeratorsList, PollsList],
  templateUrl: './adim-home.html',
  styleUrl: './adim-home.css'
})
export class AdimHome {
  admin: { id: string; name: string; email: string } | null = null;
  stats: any;

  constructor(private authService: AuthService, private adminService: AdminService) {
    const user = this.authService.getCurrentUser();
    if (user && user.role === 'Admin') {

      this.adminService.getAdmin(user.userId).subscribe({
        next: (adminData) => {
          this.admin = adminData;
          this.getAdminStats();
        },
        error: (err) => {
          console.error('Error fetching admin info', err);
        }
      });
    }
  }

  getAdminStats() {
    this.adminService.getStats().subscribe({
      next: (data) => {
        this.stats = {
          totalPollsCreated: 0,
          totalVotesVoted: 0,
          totalModeratorRegistered: 0,
          totalVotersRegistered: 0
        };

        this.animateCount('totalPollsCreated', data.totalPollsCreated);
        this.animateCount('totalVotesVoted', data.totalVotesVoted);
        this.animateCount('totalModeratorRegistered', data.totalModeratorRegistered);
        this.animateCount('totalVotersRegistered', data.totalVotersREgistered); // watch casing
      },
      error: (err) => {
        console.error('Error fetching admin stats', err);
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
