import { Injectable, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../../environments/environment';
import { AuthSessionService } from '../../../core/services/auth-session.service';

@Injectable({
  providedIn: 'root',
})
export class AiSocialSocketService {
  private readonly session = inject(AuthSessionService);
  private socket: Socket | null = null;

  readonly badgeInvalidated$ = new Subject<void>();
  readonly postPublished$ = new Subject<Record<string, any>>();
  readonly postUpdated$ = new Subject<Record<string, any>>();
  readonly postEnded$ = new Subject<string>();
  readonly postHidden$ = new Subject<Record<string, any>>();
  readonly notificationNew$ = new Subject<Record<string, any>>();

  connect(): void {
    const token = this.session.aiSocialToken();
    if (!token) return;

    if (this.socket?.connected) {
      return;
    }

    this.disconnect();

    const base = environment.aiSocialBaseUrl || window.location.origin;
    const namespaceUrl = `${base}${environment.aiSocialSocketNamespace}`;

    this.socket = io(namespaceUrl, {
      path: environment.aiSocialSocketPath,
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      auth: { token },
    });

    this.socket.on('badge.invalidate', () => {
      this.badgeInvalidated$.next();
    });

    this.socket.on('post.published', (payload: any) => {
      const data = payload?.data ?? payload;
      if (data) this.postPublished$.next(data);
    });

    this.socket.on('post.updated', (payload: any) => {
      const data = payload?.data ?? payload;
      if (data) this.postUpdated$.next(data);
    });

    this.socket.on('post.ended', (payload: any) => {
      const postId = payload?.postId ?? payload?.data?.postId;
      if (postId) this.postEnded$.next(String(postId));
    });

    this.socket.on('post.hidden', (payload: any) => {
      const data = payload?.data ?? payload;
      if (data) this.postHidden$.next(data);
    });

    this.socket.on('notification.new', (payload: any) => {
      if (payload) this.notificationNew$.next(payload);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}
