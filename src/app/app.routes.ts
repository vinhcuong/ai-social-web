import { Routes } from '@angular/router';
import { authGuard, redirectIfLoggedInGuard } from './core/guards/auth.guard';
import { AI_SOCIAL_ROUTES } from './features/ai-social/ai-social.routes';
import { AiSocialShellComponent } from './shell/ai-social-shell.component';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [redirectIfLoggedInGuard],
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'login/otp-auth',
    canActivate: [redirectIfLoggedInGuard],
    loadComponent: () =>
      import('./auth/otp-auth/otp-auth.component').then(
        (m) => m.OtpAuthComponent,
      ),
  },
  {
    path: 'auth/login',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'auth/otp-auth',
    redirectTo: 'login/otp-auth',
    pathMatch: 'full',
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
