import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { PollsList } from "../../polls/polls-list/polls-list";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-moderator-polls',
  imports: [PollsList, RouterLink],
  templateUrl: './moderator-polls.html',
  styleUrl: './moderator-polls.css'
})
export class ModeratorPolls implements OnInit{
  username: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
  }

  get isModerator(): boolean {
    return this.authService.getRole()?.toLowerCase() === 'moderator';
  }
}
