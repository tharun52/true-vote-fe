import { Component } from '@angular/core';
import { ModeratorsList } from "../../moderator/moderators-list/moderators-list";
import { PollsList } from "../../polls/polls-list/polls-list";

@Component({
  selector: 'app-adim-home',
  imports: [ModeratorsList, PollsList],
  templateUrl: './adim-home.html',
  styleUrl: './adim-home.css'
})
export class AdimHome {

}
