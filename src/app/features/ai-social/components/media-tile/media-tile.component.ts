import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { AttachmentItem } from '../../../../core/models/ai-social.models';
import { formatFileSize, isVideoAttachment } from '../../utils/post-format.util';

export type MediaLoadStatus = 'loading' | 'loaded' | 'error';

@Component({
  selector: 'app-media-tile',
  standalone: true,
  imports: [],
  templateUrl: './media-tile.component.html',
  styleUrl: './media-tile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaTileComponent {
  readonly media = input.required<AttachmentItem>();
  readonly moreCount = input<number>(0);
  readonly alt = input<string>('');
  readonly objectFit = input<'cover' | 'contain'>('cover');

  readonly mediaClick = output<void>();

  readonly loadStatus = signal<MediaLoadStatus>('loading');
  readonly retryNonce = signal<number>(0);

  readonly isVideo = computed(() => isVideoAttachment(this.media()));

  readonly rawUrl = computed(() => {
    const item = this.media();
    return item.thumbnailUrl || item.downloadUrl || item.fileUrl || '';
  });

  readonly resolvedUrl = computed(() => {
    const base = this.rawUrl();
    if (!base) return '';
    const nonce = this.retryNonce();
    if (nonce === 0) return base;
    const separator = base.includes('?') ? '&' : '?';
    return `${base}${separator}_retry=${nonce}_${Date.now()}`;
  });

  readonly fileName = computed(() => {
    const name = this.media().fileName?.trim();
    if (name) return name;
    return this.isVideo() ? 'Tệp video' : 'Tệp hình ảnh';
  });

  readonly fileSizeText = computed(() => {
    const sz = this.media().fileSize;
    return sz ? formatFileSize(sz) : '';
  });

  onLoadSuccess(): void {
    this.loadStatus.set('loaded');
  }

  onLoadError(): void {
    this.loadStatus.set('error');
  }

  onRetry(event: MouseEvent): void {
    event.stopPropagation();
    this.loadStatus.set('loading');
    this.retryNonce.update((n) => n + 1);
  }

  onTileClick(): void {
    if (this.loadStatus() === 'loaded') {
      this.mediaClick.emit();
    }
  }
}
