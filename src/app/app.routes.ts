import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { AI_SOCIAL_ROUTES } from './features/ai-social/ai-social.routes';
import { AiSocialShellComponent } from './shell/ai-social-shell.component';

export const routes: Routes = [
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'auth/otp-auth',
    loadComponent: () =>
      import('./auth/otp-auth/otp-auth.component').then(
        (m) => m.OtpAuthComponent,
      ),
  },
  {
    path: '',
    component: AiSocialShellComponent,
    canActivate: [authGuard],
    children: AI_SOCIAL_ROUTES,
  },
  {
    path: '**',
    redirectTo: 'channels/truyenthong',
  },
];
