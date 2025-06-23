import { Component } from '@angular/core';
import { ModeratorsList } from "../../moderator/moderators-list/moderators-list";

@Component({
  selector: 'app-voter-moderators',
  imports: [ModeratorsList],
  templateUrl: './voter-moderators.html',
  styleUrl: './voter-moderators.css'
})
export class VoterModerators {

}
