import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NotificationItem } from '../core/models/ai-social.models';
import { AiSocialAuthService } from '../core/services/ai-social-auth.service';
import { AuthSessionService } from '../core/services/auth-session.service';
import { AiSocialApiService } from '../features/ai-social/services/ai-social-api.service';
import { AiSocialSocketService } from '../features/ai-social/services/ai-social-socket.service';
import { AiSocialStateService } from '../features/ai-social/services/ai-social-state.service';
import { formatRelativeDate } from '../features/ai-social/utils/post-format.util';

@Component({
  selector: 'app-ai-social-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './ai-social-shell.component.html',
  styleUrls: ['./ai-social-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiSocialShellComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly session = inject(AuthSessionService);
  private readonly api = inject(AiSocialApiService);
  private readonly socket = inject(AiSocialSocketService);
  private readonly message = inject(NzMessageService);

  readonly auth = inject(AiSocialAuthService);
  readonly state = inject(AiSocialStateService);

  readonly showNotifications = signal(false);

  readonly displayName = computed(
    () =>
      this.auth.currentUser()?.fullName ||
      this.session.gcnUser()?.full_name ||
      'Nhân sự VNPT',
  );

  readonly displayUnit = computed(
    () => this.auth.currentUser()?.unit?.name || 'Tập đoàn VNPT',
  );

  readonly userInitials = computed(() => {
    const name = this.displayName();
    const parts = name.trim().split(/\s+/);
    return (parts[parts.length - 1]?.[0] || 'V').toUpperCase();
  });

  async ngOnInit(): Promise<void> {
    if (!this.auth.currentUser()) {
      await this.auth.fetchMe();
    }
    this.state.initRealtime();
  }

  isHomeRoute(): boolean {
    return this.router.url.startsWith('/home') || this.router.url === '/';
  }

  toggleNotificationPanel(): void {
    const next = !this.showNotifications();
    this.showNotifications.set(next);
    if (next && this.state.unreadNotificationCount() > 0) {
      this.api.markAllNotificationsSeen().then(() => {
        this.state.unreadNotificationCount.set(0);
      });
    }
  }

  openNotification(item: NotificationItem): void {
    this.showNotifications.set(false);
    if (item.channelCode && item.postId) {
      this.router.navigate(['/channels', item.channelCode], {
        queryParams: { highlightId: item.postId },
      });
    } else if (item.postId) {
      this.router.navigate(['/posts', item.postId]);
    }
  }

  relativeDate(iso: string): string {
    return formatRelativeDate(iso);
  }

  onLogout(): void {
    this.socket.disconnect();
    this.session.clearAll();
    this.message.success('Đã đăng xuất khỏi tài khoản');
    this.router.navigate(['/login']);
  }
}
