import { Routes } from '@angular/router';
import { ModeratorDashboard } from './moderator/moderator-dashboard/moderator-dashboard.js';
import { Signup } from './auth/signup/signup.js';
import { Login } from './auth/login/login.js';
import { VoterHome } from './voter/voter-home/voter-home.js';
import { VoterModerators } from './voter/voter-moderators/voter-moderators.js';
import { ModeratorEmails } from './moderator/moderator-emails/moderator-emails.js';
import { AddVoterEmails } from './moderator/add-voter-emails/add-voter-emails.js';
import { AdimHome } from './admin/adim-home/adim-home.js';
import { HomePage } from './shared/home-page/home-page.js';
import { authGuard } from './auth-guard.js';
import { ModeratorPolls } from './moderator/moderator-polls/moderator-polls.js';
import { AddPoll } from './polls/add-poll/add-poll.js';

export const routes: Routes = [
  { path: '', component: HomePage },

  { path: 'login', component: Login },
  { path: 'signup', component: Signup },

  { path: 'moderator', component: ModeratorDashboard, canActivate: [authGuard], data: { expectedRole: 'Moderator' } },
  { path: 'moderator/emails', component: ModeratorEmails, canActivate: [authGuard], data: { expectedRole: 'Moderator' } },
  { path: 'moderator/add-emails', component: AddVoterEmails, canActivate: [authGuard], data: { expectedRole: 'Moderator' } },
  { path: 'moderator/polls', component: ModeratorPolls, canActivate: [authGuard], data: { expectedRole: 'Moderator' } },
  { path: 'moderator/addpoll', component: AddPoll, canActivate: [authGuard], data: { expectedRole: 'Moderator' } },

  { path: 'voter', component: VoterHome, canActivate: [authGuard], data: { expectedRole: 'Voter' } },
  { path: 'voter/moderators', component: VoterModerators, canActivate: [authGuard], data: { expectedRole: 'Voter' } },

  { path: 'admin', component: AdimHome, canActivate: [authGuard], data: { expectedRole: 'Admin' } }
];
