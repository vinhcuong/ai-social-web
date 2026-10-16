import { ChangeDetectionStrategy, Component, computed, effect, input, model, signal } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { AttachmentItem } from '../../../../core/models/ai-social.models';
import { isVideoAttachment } from '../../utils/post-format.util';

@Component({
  selector: 'app-media-lightbox-modal',
  standalone: true,
  imports: [NzModalModule, NzButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nz-modal
      [nzVisible]="visible()"
      [nzTitle]="modalTitle()"
      [nzFooter]="null"
      [nzWidth]="900"
      nzCentered
      nzClassName="ai-social-modal"
      (nzOnCancel)="visible.set(false)"
    >
      <ng-container *nzModalContent>
        @if (activeAttachment(); as att) {
          <div class="lightbox-body">
            @if (hasError()) {
              <div class="lightbox-error-box">
                <div class="error-icon-circle">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#e11d48" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <div class="error-title">Không thể hiển thị phương tiện</div>
                <div class="error-desc">
                  Liên kết tệp có thể đã hết hạn hoặc máy chủ lưu trữ tạm thời không phản hồi.
                </div>
                @if (att.downloadUrl || att.fileUrl) {
                  <a
                    [href]="att.downloadUrl || att.fileUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="download-fallback-link"
                  >
                    <span>Mở liên kết gốc trong tab mới</span>
                    <span>↗</span>
                  </a>
                }
              </div>
            } @else {
              @if (isVideo()) {
                <video
                  class="media-player"
                  [src]="att.downloadUrl || att.fileUrl"
                  controls
                  autoplay
                  preload="metadata"
                  (error)="onError()"
                ></video>
              } @else {
                <img
                  class="media-image"
                  [src]="att.downloadUrl || att.fileUrl"
                  [alt]="att.fileName"
                  (error)="onError()"
                />
              }
            }

            @if (items().length > 1) {
              <div class="carousel-controls">
                <button type="button" nz-button (click)="prev()">Trước</button>
                <span class="counter">{{ activeIndex() + 1 }} / {{ items().length }}</span>
                <button type="button" nz-button (click)="next()">Tiếp</button>
              </div>
            }
          </div>
        }
      </ng-container>
    </nz-modal>
  `,
  styles: [`
    .lightbox-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
    }
    .media-image,
    .media-player {
      max-width: 100%;
      max-height: 75vh;
      border-radius: 10px;
      object-fit: contain;
      background: #f1f5f9;
    }
    .lightbox-error-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 24px;
      background: #f8fafc;
      border: 1px dashed #cbd5e1;
      border-radius: 12px;
      width: 100%;
      max-width: 600px;
      text-align: center;
      gap: 10px;

      .error-icon-circle {
        width: 52px;
        height: 52px;
        border-radius: 50%;
        background: #fff1f2;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .error-title {
        font-size: 16px;
        font-weight: 600;
        color: #1e293b;
      }
      .error-desc {
        font-size: 13px;
        color: #64748b;
        max-width: 420px;
        line-height: 1.5;
      }
      .download-fallback-link {
        margin-top: 6px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        border-radius: 8px;
        border: 1px solid #bfdbfe;
        background: #eff6ff;
        color: #0057e5;
        font-size: 13px;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.15s ease;

        &:hover {
          background: #dbeafe;
        }
      }
    }
    .carousel-controls {
      display: flex;
      align-items: center;
      gap: 16px;

      .counter {
        font-size: 13px;
        font-weight: 600;
        color: #475569;
      }
    }
  `],
})
export class MediaLightboxModalComponent {
  readonly visible = model<boolean>(false);
  readonly items = input<AttachmentItem[]>([]);
  readonly activeIndex = model<number>(0);
  readonly hasError = signal<boolean>(false);

  constructor() {
    effect(() => {
      // Whenever the active attachment or modal visibility changes, reset error
      this.activeIndex();
      this.visible();
      this.hasError.set(false);
    });
  }

  readonly activeAttachment = computed<AttachmentItem | null>(() => {
    const list = this.items();
    const idx = this.activeIndex();
    return list[idx] || list[0] || null;
  });

  readonly modalTitle = computed(() => this.activeAttachment()?.fileName || 'Xem phương tiện');

  readonly isVideo = computed(() => {
    const att = this.activeAttachment();
    return att ? isVideoAttachment(att) : false;
  });

  onError(): void {
    this.hasError.set(true);
  }

  prev(): void {
    const total = this.items().length;
    if (total <= 1) return;
    this.activeIndex.set((this.activeIndex() - 1 + total) % total);
  }

  next(): void {
    const total = this.items().length;
    if (total <= 1) return;
    this.activeIndex.set((this.activeIndex() + 1) % total);
  }
}
