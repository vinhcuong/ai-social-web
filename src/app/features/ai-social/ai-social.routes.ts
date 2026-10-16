import { Routes } from '@angular/router';

export const AI_SOCIAL_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./views/home-page/ai-social-home-page.component').then(
        (m) => m.AiSocialHomePageComponent,
      ),
  },
  {
    path: 'channels/:channelCode',
    loadComponent: () =>
      import('./views/channel-feed-page/channel-feed-page.component').then(
        (m) => m.ChannelFeedPageComponent,
      ),
  },
  {
    path: 'posts/by-code/:code',
    loadComponent: () =>
      import('./views/post-detail/post-detail.component').then(
        (m) => m.PostDetailComponent,
      ),
  },
  {
    path: 'posts/:postId',
    loadComponent: () =>
      import('./views/post-detail/post-detail.component').then(
        (m) => m.PostDetailComponent,
      ),
  },
];
