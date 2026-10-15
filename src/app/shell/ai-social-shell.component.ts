import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CHANNELS_META, ChannelCode } from '../core/constants/storage-keys';
import { NotificationItem } from '../core/models/ai-social.models';
import { AiSocialAuthService } from '../core/services/ai-social-auth.service';
import { AuthSessionService } from '../core/services/auth-session.service';
import { AiSocialApiService } from '../features/ai-social/services/ai-social-api.service';
import { AiSocialSocketService } from '../features/ai-social/services/ai-social-socket.service';
import { AiSocialStateService } from '../features/ai-social/services/ai-social-state.service';
import { formatRelativeDate } from '../features/ai-social/utils/post-format.util';
import { AppIcon } from '../shared/icon/icon';

@Component({
  selector: 'app-ai-social-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    AppIcon,
  ],
  templateUrl: './ai-social-shell.component.html',
  styleUrls: ['./ai-social-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiSocialShellComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly session = inject(AuthSessionService);
  private readonly api = inject(AiSocialApiService);
  private readonly socket = inject(AiSocialSocketService);

  readonly auth = inject(AiSocialAuthService);
  readonly state = inject(AiSocialStateService);

  readonly channels = CHANNELS_META;
  readonly showNotifications = signal(false);
  readonly mobileSidebarOpen = signal(false);

  readonly userInitials = computed(() => {
    const name = this.auth.currentUser()?.fullName || 'VN';
    const parts = name.trim().split(/\s+/);
    return (parts[parts.length - 1]?.[0] || 'V').toUpperCase();
  });

  async ngOnInit(): Promise<void> {
    if (!this.auth.currentUser()) {
      await this.auth.fetchMe();
    }
    this.state.initRealtime();
  }

  badgeFor(code: ChannelCode): number {
    return this.state.badges()[code] || 0;
  }

  toggleNotificationPanel(): void {
    const next = !this.showNotifications();
    this.showNotifications.set(next);
    if (next && this.state.unreadNotificationCount() > 0) {
      this.api.markNotificationsSeen({ all: true }).then(() => {
        this.state.unreadNotificationCount.set(0);
      });
    }
  }

  openNotification(item: NotificationItem): void {
    this.showNotifications.set(false);
    if (item.postId) {
      this.router.navigate(['/posts', item.postId]);
    }
  }

  relativeDate(iso: string): string {
    return formatRelativeDate(iso);
  }

  onLogout(): void {
    this.socket.disconnect();
    this.session.clearAll();
    this.router.navigate(['/auth/login']);
  }
}
