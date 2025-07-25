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
import { VoterPolls } from './voter/voter-polls/voter-polls.js';
import { AddModerator } from './admin/add-moderator/add-moderator.js';
import { AdminModeratorList } from './admin/admin-moderator-list/admin-moderator-list.js';
import { AdminSignup } from './auth/admin-signup/admin-signup.js';
import { AuditLogs } from './admin/audit-logs/audit-logs.js';
import { NoAuthGuard } from './no-auth.guard.js';
import { VoterMessage } from './voter/voter-message/voter-message.js';
import { ModeratorMessage } from './moderator/moderator-message/moderator-message.js';


export const routes: Routes = [
  { path: '', component: HomePage, canActivate: [NoAuthGuard] },
  { path: 'login', component: Login, canActivate: [NoAuthGuard] },
  { path: 'signup', component: Signup, canActivate: [NoAuthGuard] },

  { path: 'moderator', component: ModeratorDashboard, canActivate: [authGuard], data: { expectedRole: 'Moderator' } },
  { path: 'moderator/emails', component: ModeratorEmails, canActivate: [authGuard], data: { expectedRole: 'Moderator' } },
  { path: 'moderator/add-emails', component: AddVoterEmails, canActivate: [authGuard], data: { expectedRole: 'Moderator' } },
  { path: 'moderator/polls', component: ModeratorPolls, canActivate: [authGuard], data: { expectedRole: 'Moderator' } },
  { path: 'moderator/addpoll', component: AddPoll, canActivate: [authGuard], data: { expectedRole: 'Moderator' } },
  { path: 'moderator/messages', component: ModeratorMessage, canActivate: [authGuard], data: { expectedRole: 'Moderator' } },
  
  { path: 'voter', component: VoterHome, canActivate: [authGuard], data: { expectedRole: 'Voter' } },
  { path: 'voter/moderators', component: VoterModerators, canActivate: [authGuard], data: { expectedRole: 'Voter' } },
  { path: 'voter/polls', component: VoterPolls, canActivate: [authGuard], data: { expectedRole: 'Voter' } },
  { path: 'voter/messages', component: VoterMessage, canActivate: [authGuard], data: { expectedRole: 'Voter' } },
  
  { path: 'admin', component: AdimHome, canActivate: [authGuard], data: { expectedRole: 'Admin' } },
  { path: 'admin/addmoderator', component: AddModerator, canActivate: [authGuard], data: { expectedRole: 'Admin' } },
  { path: 'admin/moderatorlist', component: AdminModeratorList, canActivate: [authGuard], data: { expectedRole: 'Admin' } },
  { path: 'admin/auditlogs', component: AuditLogs, canActivate: [authGuard], data: { expectedRole: 'Admin' } },
  { path: 'admin/signup', component: AdminSignup, canActivate: [NoAuthGuard] }

];
