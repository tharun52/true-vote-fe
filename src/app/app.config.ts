import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { AuthService } from './auth/auth.service';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { VoterService } from './voter/voter.service';
import { ModeratorService } from './moderator/moderator.service';
import { AuthInterceptor } from './auth/auth-interceptor';
import { PollService } from './polls/poll.service';
import { ToastService } from './shared/ToastService';
import { AdminService } from './admin/admin.service';
import { MessageService } from './message/message.service';
import { UserService } from './shared/UserService';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    AuthService,
    provideHttpClient(withInterceptorsFromDi()),  
        {
            provide:HTTP_INTERCEPTORS,
            useClass:AuthInterceptor,
            multi:true
        },
    VoterService,
    ModeratorService,
    AdminService,
    PollService,
    ToastService,
    MessageService,
    UserService
  ]
};
