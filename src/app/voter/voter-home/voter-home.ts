import { Component } from '@angular/core';
import { PollsList } from "../../polls/polls-list/polls-list";

@Component({
  selector: 'app-voter-home',
  imports: [PollsList],
  templateUrl: './voter-home.html',
  styleUrl: './voter-home.css'
})
export class VoterHome {

}
