import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from '../../../environments/environment';
import { ChannelCode, CHANNELS_META } from '../constants/storage-keys';
import { PostModel } from '../models/ai-social.models';
import { AiSocialAuthService } from './ai-social-auth.service';

declare global {
  interface Window {
    GoConnectBridge?: {
      postMessage: (payload: string) => void;
    };
    receiveGcnToken?: (token: string) => void;
  }
}

@Injectable({
  providedIn: 'root',
})
export class AiSocialHostBridgeService {
  private readonly authService = inject(AiSocialAuthService);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);

  readonly isEmbeddedWebView = signal<boolean>(false);

  constructor() {
    this.detectEnvironment();
    this.registerGlobalTokenListener();
  }

  detectEnvironment(): void {
    const hasBridge = typeof window !== 'undefined' && !!window.GoConnectBridge;
    const urlEmbed =
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('embed') === '1';
    this.isEmbeddedWebView.set(hasBridge || urlEmbed);
  }

  private registerGlobalTokenListener(): void {
    if (typeof window === 'undefined') return;
    window.receiveGcnToken = async (token: string) => {
      if (!token) return;
      const ok = await this.authService.loginWithGcnToken(token);
      if (ok) {
        const target = this.authService.redirectUrl || '/channels/truyenthong';
        this.authService.redirectUrl = null;
        this.router.navigateByUrl(target);
      }
    };
  }

  getPostShareUrl(post: PostModel): string {
    const shareCode = post.code?.trim() || post.id;
    const origin =
      typeof window !== 'undefined' && window.location?.origin
        ? window.location.origin
        : environment.shareBaseUrl;
    return `${origin}/r/p/${shareCode}`;
  }

  canUseWebShareApi(): boolean {
    return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  }

  forwardToGoConnectWebView(post: PostModel): boolean {
    if (typeof window !== 'undefined' && window.GoConnectBridge?.postMessage) {
      const permalink = this.getPostShareUrl(post);
      window.GoConnectBridge.postMessage(
        JSON.stringify({
          action: 'openChatForward',
          postId: post.id,
          title: post.title,
          permalink,
          channelCode: post.channelCode,
        }),
      );
      return true;
    }
    return false;
  }

  async shareViaOsSheet(post: PostModel): Promise<boolean> {
    const permalink = this.getPostShareUrl(post);
    const channelName =
      CHANNELS_META.find((c) => c.code === post.channelCode)?.name || 'VNPT AI Social';

    if (this.canUseWebShareApi()) {
      try {
        await navigator.share({
          title: post.title,
          text: `[${channelName}] ${post.title}`,
          url: permalink,
        });
        return true;
      } catch (err: any) {
        if (err?.name === 'AbortError') return false;
      }
    }
    return this.copyLink(permalink);
  }

  async copyLink(url: string): Promise<boolean> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      this.message.success('Đã sao chép liên kết bài viết');
      return true;
    } catch {
      this.message.error('Không thể sao chép liên kết');
      return false;
    }
  }

  openFileViewer(fileUrl: string, fileName?: string): void {
    if (typeof window !== 'undefined' && window.GoConnectBridge?.postMessage) {
      window.GoConnectBridge.postMessage(
        JSON.stringify({
          action: 'openFileViewer',
          fileUrl,
          fileName: fileName || '',
        }),
      );
      return;
    }
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  }
}
