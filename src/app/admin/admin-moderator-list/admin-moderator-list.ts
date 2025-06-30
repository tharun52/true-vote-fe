import { Component } from '@angular/core';
import { ModeratorsList } from "../../moderator/moderators-list/moderators-list";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-moderator-list',
  imports: [ModeratorsList, RouterLink],
  templateUrl: './admin-moderator-list.html',
  styleUrl: './admin-moderator-list.css'
})
export class AdminModeratorList {

}
