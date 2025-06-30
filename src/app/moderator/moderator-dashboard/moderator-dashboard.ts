import { Component } from '@angular/core';
import { ModeratorModel } from '../../models/ModeratorModel';
import { AuthService } from '../../auth/auth.service';
import { PollsList } from "../../polls/polls-list/polls-list";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-moderator-dashboard',
  imports: [PollsList, RouterLink],
  templateUrl: './moderator-dashboard.html',
  styleUrl: './moderator-dashboard.css'
})
export class ModeratorDashboard {
  moderator: ModeratorModel | null = null;

  constructor(private authService: AuthService) {
    const user = this.authService.getCurrentUser();
    if (user && user.role === 'Moderator') {
      this.moderator = {
        id: user.userId,
        name: user.username,
        email: `${user.username}@example.com`, 
        isDeleted: false
      };
    }
  }
}
