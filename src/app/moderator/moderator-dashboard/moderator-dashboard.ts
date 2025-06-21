import { Component } from '@angular/core';
import { ModeratorModel } from '../../models/ModeratorModel';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-moderator-dashboard',
  imports: [],
  templateUrl: './moderator-dashboard.html',
  styleUrl: './moderator-dashboard.css'
})
export class ModeratorDashboard {
  moderator: ModeratorModel | null = null;

  constructor(private authService: AuthService) {
    const user = this.authService.getCurrentUser();
    if (user && user.role === 'Moderator') {
      this.moderator = {
        Id: user.userId,
        name: user.username,
        email: `${user.username}@example.com`, 
        isdeleted: false
      };
    }
  }
}
