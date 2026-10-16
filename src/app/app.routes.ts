import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'otp',
    loadComponent: () =>
      import('./auth/otp-auth/otp-auth.component').then((m) => m.OtpAuthComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./shell/ai-social-shell.component').then(
        (m) => m.AiSocialShellComponent,
      ),
    loadChildren: () =>
      import('./features/ai-social/ai-social.routes').then(
        (m) => m.AI_SOCIAL_ROUTES,
      ),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
