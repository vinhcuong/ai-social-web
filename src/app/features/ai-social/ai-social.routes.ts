import { Routes } from '@angular/router';

export const AI_SOCIAL_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'channels/truyenthong',
    pathMatch: 'full',
  },
  {
    path: 'channels/:channelCode',
    loadComponent: () =>
      import('./views/channel-feed-page/channel-feed-page.component').then(
        (m) => m.ChannelFeedPageComponent,
      ),
  },
  {
    path: 'posts/:postId',
    loadComponent: () =>
      import('./views/post-detail/post-detail.component').then(
        (m) => m.PostDetailComponent,
      ),
  },
  {
    path: 'r/p/:code',
    loadComponent: () =>
      import('./views/post-detail/post-detail.component').then(
        (m) => m.PostDetailComponent,
      ),
  },
];
