import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AttachmentItem, ChannelCategoryModel, PostModel } from '../../../../../core/models/ai-social.models';
import { AiSocialAuthService } from '../../../../../core/services/ai-social-auth.service';
import { AiSocialHostBridgeService } from '../../../../../core/services/ai-social-host-bridge.service';
import { InlineComposerCardComponent } from '../../../components/composer/inline-composer-card/inline-composer-card.component';
import { MediaTileComponent } from '../../../components/media-tile/media-tile.component';
import { AiSocialApiService } from '../../../services/ai-social-api.service';
import {
  formatFileSize,
  getAttachmentMediaUrl,
  isImageAttachment,
  isVideoAttachment,
  renderMarkdownToHtml,
} from '../../../utils/post-format.util';

@Component({
  selector: 'app-emergency-channel-view',
  standalone: true,
  imports: [RouterLink, InlineComposerCardComponent, MediaTileComponent],
  templateUrl: './emergency-channel-view.component.html',
  styleUrls: ['./emergency-channel-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmergencyChannelViewComponent {
  private readonly api = inject(AiSocialApiService);
  private readonly auth = inject(AiSocialAuthService);
  private readonly bridge = inject(AiSocialHostBridgeService);
  private readonly message = inject(NzMessageService);

  readonly posts = input.required<PostModel[]>();
  readonly categories = input<ChannelCategoryModel[]>([]);
  readonly loading = input<boolean>(false);
  readonly highlightId = input<string | null>(null);

  readonly postCreated = output<PostModel>();
  readonly postUpdated = output<PostModel>();
  readonly postDeleted = output<string>();
  readonly shareRequested = output<PostModel>();
  readonly statsRequested = output<PostModel>();
  readonly mediaClicked = output<{ items: AttachmentItem[]; index: number }>();

  readonly ackingPostId = signal<string>('');
  readonly canManage = this.auth.canPublishInChannel('khan');

  isEnded(post: PostModel): boolean {
    return post.status === 'ended' || !!post.endedAt;
  }

  isUrgentBroadcast(post: PostModel): boolean {
    if (this.isEnded(post)) return false;
    const hasCategory = !!post.categoryCode && post.categoryCode.trim().length > 0;
    return !!post.isMandatory || hasCategory || this.hasDistinctAction(post) || !!this.getDeadlineText(post);
  }

  getWhatText(post: PostModel): string {
    if (post.content && typeof post.content === 'object') {
      return String(post.content['what'] || post.content['body'] || '').trim();
    }
    return typeof post.content === 'string' ? post.content.trim() : '';
  }

  getActionText(post: PostModel): string {
    if (post.content && typeof post.content === 'object' && post.content['action']) {
      return String(post.content['action']).trim();
    }
    return '';
  }

  hasDistinctAction(post: PostModel): boolean {
    const act = this.getActionText(post);
    return (
      act.length > 0 &&
      act !== 'Thực hiện theo hướng dẫn đính kèm.' &&
      act !== 'Xem hướng dẫn chi tiết và triển khai ngay.'
    );
  }

  renderRichContent(raw: string): string {
    return renderMarkdownToHtml(raw);
  }

  getDeadlineText(post: PostModel): string {
    if (post.content && typeof post.content === 'object' && post.content['deadline']) {
      return String(post.content['deadline']).trim();
    }
    return '';
  }

  getEndNote(post: PostModel): string {
    if (post.content && typeof post.content === 'object' && post.content['endNote']) {
      return String(post.content['endNote']);
    }
    return post.broadcastReason || 'Đã kết thúc phát thông báo khẩn.';
  }

  getAudienceLabel(post: PostModel): string {
    if (post.audienceAll !== false) return 'Toàn công ty';
    if (post.audienceUnits?.length) return post.audienceUnits.map((u) => u.name).join(', ');
    return post.audienceSummary || 'Toàn công ty';
  }

  getCategoryLabel(code?: string | null): string {
    if (!code) return '';
    const labels: Record<string, string> = {
      'thien_tai': 'Thiên tai & bão lũ',
      'thien-tai-bao-lu': 'Thiên tai & bão lũ',
      'dich_benh': 'Dịch bệnh & Y tế',
      'dich-benh-y-te': 'Dịch bệnh & Y tế',
      'ha_tang_cntt': 'Sự cố hạ tầng',
      'su-co-ha-tang': 'Sự cố hạ tầng',
      'an_ninh': 'An toàn thông tin',
      'an-toan-thong-tin': 'An toàn thông tin',
      'an_toan_thong_tin': 'An toàn thông tin',
    };
    if (labels[code]) return labels[code];
    const found = this.categories().find((c) => c.code === code);
    return found ? found.name : code;
  }

  formatClock(iso?: string | null): string {
    if (!iso) return '08:00';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  formatSize(bytes?: number | null): string {
    if (!bytes || bytes <= 0) return '410 KB';
    return formatFileSize(bytes);
  }

  getMediaAttachments(post: PostModel): AttachmentItem[] {
    return (post.attachments || []).filter((a) => isImageAttachment(a) || isVideoAttachment(a));
  }

  getDocumentAttachments(post: PostModel): AttachmentItem[] {
    return (post.attachments || []).filter((a) => !isImageAttachment(a) && !isVideoAttachment(a));
  }

  isVideo(att: AttachmentItem): boolean {
    return isVideoAttachment(att);
  }

  getMediaUrl(att: AttachmentItem): string {
    return getAttachmentMediaUrl(att);
  }

  openMedia(post: PostModel, index: number): void {
    const items = this.getMediaAttachments(post);
    if (items.length) this.mediaClicked.emit({ items, index });
  }

  openAttachment(att: AttachmentItem): void {
    const url = att.downloadUrl || att.fileUrl;
    if (!url) {
      this.message.warning('Tệp đính kèm không khả dụng hoặc liên kết đã hết hạn.');
      return;
    }
    this.bridge.openFileViewer(url, att.fileName);
  }

  async copyPostLink(post: PostModel): Promise<void> {
    const url = `${window.location.origin}/channels/khan?highlightId=${post.id}`;
    await this.bridge.copyLink(url);
    this.api.trackShare(post.id, { source: 'web', target: 'copy_link' }).catch(() => {});
  }

  async onAcknowledge(post: PostModel): Promise<void> {
    if (post.isRead || this.ackingPostId() === post.id) return;
    this.ackingPostId.set(post.id);
    try {
      await this.api.markRead(post.id, post.requiredAckVersion || 1);
      this.postUpdated.emit({ ...post, isRead: true, readCount: (post.readCount || 0) + 1 });
      this.message.success('Đã xác nhận đọc thông báo!');
    } finally {
      this.ackingPostId.set('');
    }
  }
}
