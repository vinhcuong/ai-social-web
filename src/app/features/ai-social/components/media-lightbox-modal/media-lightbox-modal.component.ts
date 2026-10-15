import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
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
            @if (isVideo()) {
              <video
                class="media-player"
                [src]="att.downloadUrl || att.fileUrl"
                controls
                autoplay
                preload="metadata"
              ></video>
            } @else {
              <img
                class="media-image"
                [src]="att.downloadUrl || att.fileUrl"
                [alt]="att.fileName"
              />
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
      background: #0f172a;
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
