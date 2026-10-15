import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AttachmentItem, PollModel, PostModel } from '../../../../core/models/ai-social.models';
import { AiSocialAuthService } from '../../../../core/services/ai-social-auth.service';
import { AiSocialHostBridgeService } from '../../../../core/services/ai-social-host-bridge.service';
import { AppIcon } from '../../../../shared/icon/icon';
import { AiSocialApiService } from '../../services/ai-social-api.service';
import {
  extractPostMarkdownBody,
  formatFileSize,
  formatRelativeDate,
  getTargetAudienceLabel,
  isImageAttachment,
  isVideoAttachment,
  renderMarkdownToHtml,
} from '../../utils/post-format.util';
import { EventRsvpCardComponent } from '../event-rsvp-card/event-rsvp-card.component';
import { PollCardComponent } from '../poll-card/poll-card.component';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [
    RouterLink,
    NzButtonComponent,
    AppIcon,
    PollCardComponent,
    EventRsvpCardComponent,
  ],
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostCardComponent {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly api = inject(AiSocialApiService);
  private readonly auth = inject(AiSocialAuthService);
  private readonly bridge = inject(AiSocialHostBridgeService);
  private readonly message = inject(NzMessageService);

  readonly post = input.required<PostModel>();
  readonly postChanged = output<PostModel>();
  readonly postDeleted = output<string>();
  readonly shareRequested = output<PostModel>();
  readonly mediaClicked = output<{ items: AttachmentItem[]; index: number }>();

  readonly ackLoading = signal(false);
  readonly heartLoading = signal(false);
  readonly remindLoading = signal(false);

  readonly canManage = computed(() =>
    this.auth.canPublishInChannel(this.post().channelCode),
  );

  readonly relativeDate = computed(() =>
    formatRelativeDate(this.post().publishedAt || this.post().createdAt),
  );

  readonly audienceLabel = computed(() => getTargetAudienceLabel(this.post()));

  readonly renderedHtml = computed<SafeHtml>(() => {
    const md = extractPostMarkdownBody(this.post());
    const html = renderMarkdownToHtml(md);
    return this.sanitizer.bypassSecurityTrustHtml(html);
  });

  readonly mediaAttachments = computed(() =>
    (this.post().attachments || []).filter(
      (a) => isImageAttachment(a) || isVideoAttachment(a),
    ),
  );

  readonly documentAttachments = computed(() =>
    (this.post().attachments || []).filter(
      (a) => !isImageAttachment(a) && !isVideoAttachment(a),
    ),
  );

  readonly readRatePercent = computed(() => {
    const p = this.post();
    if (!p.recipientCount || p.recipientCount <= 0) return 0;
    return Math.min(100, Math.round(((p.readCount || 0) / p.recipientCount) * 100));
  });

  isVideo(att: AttachmentItem): boolean {
    return isVideoAttachment(att);
  }

  fileSizeText(bytes: number): string {
    return formatFileSize(bytes);
  }

  openMedia(index: number): void {
    this.mediaClicked.emit({ items: this.mediaAttachments(), index });
  }

  openDocument(att: AttachmentItem): void {
    this.bridge.openFileViewer(att.downloadUrl || att.fileUrl, att.fileName);
  }

  async onAckRead(): Promise<void> {
    const p = this.post();
    if (p.isRead || this.ackLoading()) return;
    this.ackLoading.set(true);
    try {
      await this.api.markRead(p.id, p.requiredAckVersion || 1);
      this.postChanged.emit({
        ...p,
        isRead: true,
        readCount: (p.readCount || 0) + 1,
      });
      this.message.success('Đã xác nhận đọc thông tin');
    } catch (e: any) {
      this.message.error(e?.error?.message || 'Không thể xác nhận đã đọc');
    } finally {
      this.ackLoading.set(false);
    }
  }

  async onToggleHeart(): Promise<void> {
    const p = this.post();
    if (this.heartLoading()) return;
    this.heartLoading.set(true);
    const nextHearted = !p.isHearted;
    const nextCount = Math.max(0, (p.heartCount || 0) + (nextHearted ? 1 : -1));
    this.postChanged.emit({ ...p, isHearted: nextHearted, heartCount: nextCount });
    try {
      await this.api.toggleHeart(p.id);
    } catch {
      this.postChanged.emit(p);
    } finally {
      this.heartLoading.set(false);
    }
  }

  onPollUpdated(updatedPoll: PollModel): void {
    this.postChanged.emit({ ...this.post(), poll: updatedPoll });
  }

  async onRemindUnread(): Promise<void> {
    const p = this.post();
    this.remindLoading.set(true);
    try {
      await this.api.remindPost(p.id, 'all');
      this.message.success('Đã gửi thông báo nhắc đọc tới các nhân sự chưa xác nhận');
    } catch (e: any) {
      this.message.error(e?.error?.message || 'Không thể gửi nhắc đọc');
    } finally {
      this.remindLoading.set(false);
    }
  }

  async onTogglePin(): Promise<void> {
    const p = this.post();
    const nextPin = !p.pinnedAt;
    try {
      await this.api.setPostPinned(p.id, nextPin);
      this.postChanged.emit({
        ...p,
        pinnedAt: nextPin ? new Date().toISOString() : null,
      });
      this.message.success(nextPin ? 'Đã ghim bài viết' : 'Đã bỏ ghim bài viết');
    } catch (e: any) {
      this.message.error(e?.error?.message || 'Không thể thay đổi trạng thái ghim');
    }
  }

  async onEndEmergency(): Promise<void> {
    const p = this.post();
    try {
      await this.api.endEmergencyPost(p.id);
      this.postChanged.emit({
        ...p,
        status: 'ended',
        endedAt: new Date().toISOString(),
      });
      this.message.success('Đã kết thúc thông báo khẩn');
    } catch (e: any) {
      this.message.error(e?.error?.message || 'Không thể kết thúc thông báo khẩn');
    }
  }

  async onDeletePost(): Promise<void> {
    const p = this.post();
    if (!confirm(`Bạn có chắc chắn muốn xóa bài viết "${p.title}"?`)) return;
    try {
      await this.api.deletePost(p.id);
      this.postDeleted.emit(p.id);
      this.message.success('Đã xóa bài viết');
    } catch (e: any) {
      this.message.error(e?.error?.message || 'Không thể xóa bài viết');
    }
  }
}
