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
  isLoadingAdmin = true;
  isLoadingStats = false;

  constructor(private authService: AuthService, private adminService: AdminService) {
    const user = this.authService.getCurrentUser();
    if (user && user.role === 'Admin') {
      this.adminService.getAdmin(user.userId).subscribe({
        next: (adminData) => {
          this.admin = adminData;
          this.isLoadingAdmin = false;
          this.getAdminStats();
        },
        error: (err) => {
          console.error('Error fetching admin info', err);
          this.isLoadingAdmin = false;
        }
      });
    } else {
      this.isLoadingAdmin = false;
    }
  }

  getAdminStats() {
    this.isLoadingStats = true;

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
        this.animateCount('totalVotersRegistered', data.totalVotersREgistered);
        this.isLoadingStats = false;
      },
      error: (err) => {
        console.error('Error fetching admin stats', err);
        this.isLoadingStats = false;
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
