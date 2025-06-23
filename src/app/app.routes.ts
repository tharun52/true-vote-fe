import { Routes } from '@angular/router';
import { ModeratorDashboard } from './moderator/moderator-dashboard/moderator-dashboard.js';
import { Signup } from './auth/signup/signup.js';
import { Login } from './auth/login/login.js';
import { VoterHome } from './voter/voter-home/voter-home.js';
import { Component } from '@angular/core';
import { VoterModerators } from './voter/voter-moderators/voter-moderators.js';
import { ModeratorEmails } from './moderator/moderator-emails/moderator-emails.js';
import { VoterDetail } from './voter/voter-detail/voter-detail.js';

export const routes: Routes = [
  { path: 'login', component: Login },
  //   { path: '', component: },
  { path: 'signup', component: Signup },
  { path: 'moderator', component: ModeratorDashboard },
  { path: 'voter', component: VoterHome },
  { path: 'voter/moderators', component: VoterModerators },
  { path: 'moderator/emails', component: ModeratorEmails },
];
