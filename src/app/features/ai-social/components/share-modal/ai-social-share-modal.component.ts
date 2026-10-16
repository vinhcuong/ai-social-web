import { ChangeDetectionStrategy, Component, computed, inject, input, model } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { CHANNELS_META } from '../../../../core/constants/storage-keys';
import { PostModel } from '../../../../core/models/ai-social.models';
import { AiSocialHostBridgeService } from '../../../../core/services/ai-social-host-bridge.service';
import { AiSocialApiService } from '../../services/ai-social-api.service';
import { AppIcon } from '../../../../shared/icon/icon';

@Component({
  selector: 'app-ai-social-share-modal',
  standalone: true,
  imports: [NzModalModule, NzButtonComponent, AppIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nz-modal
      [nzVisible]="visible()"
      nzTitle="Chia sẻ bài viết"
      [nzFooter]="null"
      [nzWidth]="480"
      nzClassName="ai-social-modal"
      (nzOnCancel)="visible.set(false)"
    >
      <ng-container *nzModalContent>
        @if (post(); as item) {
          <div class="share-sheet">
            <div class="post-preview-card">
              <span class="channel-badge">{{ channelLabel() }}</span>
              <h4 class="post-title">{{ item.title }}</h4>
              <p class="permalink-text">{{ shareUrl() }}</p>
            </div>

            <div class="share-actions">
              @if (bridge.isEmbeddedWebView()) {
                <button
                  type="button"
                  nz-button
                  nzType="primary"
                  nzSize="large"
                  class="share-btn"
                  (click)="onForwardToGoConnect()"
                >
                  <app-icon name="send_message" [size]="18" />
                  <span>Gửi vào tin nhắn GoConnect</span>
                </button>
              }

              @if (bridge.canUseWebShareApi()) {
                <button
                  type="button"
                  nz-button
                  nzType="primary"
                  nzSize="large"
                  class="share-btn"
                  (click)="onNativeWebShare()"
                >
                  <app-icon name="share-01" [size]="18" />
                  <span>Chia sẻ qua ứng dụng (Zalo, Telegram, GoConnect...)</span>
                </button>
              }

              <button
                type="button"
                nz-button
                nzType="default"
                nzSize="large"
                class="share-btn copy-btn"
                (click)="onCopyLink()"
              >
                <app-icon name="copy" [size]="18" />
                <span>Sao chép liên kết bài viết</span>
              </button>
            </div>
          </div>
        }
      </ng-container>
    </nz-modal>
  `,
  styles: [`
    .share-sheet {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .post-preview-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 14px 16px;

      .channel-badge {
        display: inline-block;
        font-size: 11px;
        font-weight: 600;
        color: #0066b3;
        background: #eff6ff;
        padding: 2px 8px;
        border-radius: 999px;
        margin-bottom: 6px;
      }
      .post-title {
        font-size: 15px;
        font-weight: 600;
        color: #0f172a;
        margin: 0 0 6px;
      }
      .permalink-text {
        font-size: 12px;
        color: #64748b;
        margin: 0;
        word-break: break-all;
      }
    }
    .share-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .share-btn {
        width: 100%;
        height: 44px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-weight: 600;
      }
    }
  `],
})
export class AiSocialShareModalComponent {
  readonly bridge = inject(AiSocialHostBridgeService);
  private readonly api = inject(AiSocialApiService);

  readonly visible = model<boolean>(false);
  readonly post = input<PostModel | null>(null);

  readonly shareUrl = computed(() => {
    const p = this.post();
    return p ? this.bridge.getPostShareUrl(p) : '';
  });

  readonly channelLabel = computed(() => {
    const p = this.post();
    if (!p) return '';
    return CHANNELS_META.find((c) => c.code === p.channelCode)?.name || p.channelCode;
  });

  onForwardToGoConnect(): void {
    const p = this.post();
    if (!p) return;
    this.bridge.forwardToGoConnectWebView(p);
    this.api.trackShare(p.id, { source: 'web', target: 'gcn_forward' }).catch(() => {});
    this.visible.set(false);
  }

  async onNativeWebShare(): Promise<void> {
    const p = this.post();
    if (!p) return;
    await this.bridge.shareViaOsSheet(p);
    this.api.trackShare(p.id, { source: 'web', target: 'system_share' }).catch(() => {});
    this.visible.set(false);
  }

  async onCopyLink(): Promise<void> {
    const url = this.shareUrl();
    if (!url) return;
    const p = this.post();
    if (p) this.api.trackShare(p.id, { source: 'web', target: 'copy_link' }).catch(() => {});
    await this.bridge.copyLink(url);
    this.visible.set(false);
  }
}
