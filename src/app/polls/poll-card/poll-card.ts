import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-poll-card',
  imports: [],
  templateUrl: './poll-card.html',
  styleUrl: './poll-card.css'
})
export class PollCard {
  @Input() poll: any;
}
