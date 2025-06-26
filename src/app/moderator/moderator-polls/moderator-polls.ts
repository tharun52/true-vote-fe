import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { PollsList } from "../../polls/polls-list/polls-list";

@Component({
  selector: 'app-moderator-polls',
  imports: [PollsList],
  templateUrl: './moderator-polls.html',
  styleUrl: './moderator-polls.css'
})
export class ModeratorPolls implements OnInit{
  username: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
  }
}
