import { Component, OnInit } from '@angular/core';
import { PollsList } from "../../polls/polls-list/polls-list";
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-voter-home',
  imports: [PollsList],
  templateUrl: './voter-home.html',
  styleUrl: './voter-home.css'
})
export class VoterHome implements OnInit {
  voterId: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.voterId = this.authService.getCurrentUser()?.userId ?? null;
  }
}
