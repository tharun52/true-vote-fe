import { Component } from '@angular/core';
import { PollsList } from '../../polls/polls-list/polls-list';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-voter-polls',
  imports: [PollsList],
  templateUrl: './voter-polls.html',
  styleUrl: './voter-polls.css'
})
export class VoterPolls {
  voterId: string | null = null;
  
    constructor(private authService: AuthService) {}
  
    ngOnInit(): void {
      this.voterId = this.authService.getCurrentUser()?.userId ?? null;
    }
}
