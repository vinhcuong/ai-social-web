import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AttachmentItem, ChannelCategoryModel, PostModel } from '../../../../../core/models/ai-social.models';
import { UpcomingScheduleDayGroup, UpcomingScheduleEventItem } from '../../../../../core/models/ai-social-extended.models';
import { AiSocialHostBridgeService } from '../../../../../core/services/ai-social-host-bridge.service';
import { InlineComposerCardComponent } from '../../../components/composer/inline-composer-card/inline-composer-card.component';
import { MediaTileComponent } from '../../../components/media-tile/media-tile.component';
import { AiSocialApiService } from '../../../services/ai-social-api.service';
import {
  formatFileSize, formatRelativeDate, getAttachmentMediaUrl,
  isImageAttachment, isVideoAttachment,
} from '../../../utils/post-format.util';
import { EventSidebarCalendarComponent } from './event-sidebar-calendar.component';

@Component({
  selector: 'app-event-channel-view',
  standalone: true,
  imports: [FormsModule, RouterLink, NzButtonComponent, InlineComposerCardComponent, EventSidebarCalendarComponent, MediaTileComponent],
  templateUrl: './event-channel-view.component.html',
  styleUrls: ['./event-channel-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventChannelViewComponent {
  private readonly api = inject(AiSocialApiService);
  private readonly bridge = inject(AiSocialHostBridgeService);
  private readonly message = inject(NzMessageService);

  readonly posts = input.required<PostModel[]>();
  readonly categories = input<ChannelCategoryModel[]>([]);
  readonly scheduleGroups = input<UpcomingScheduleDayGroup[]>([]);
  readonly loading = input<boolean>(false);
  readonly highlightId = input<string | null>(null);

  readonly postCreated = output<PostModel>();
  readonly postUpdated = output<PostModel>();
  readonly shareRequested = output<PostModel>();
  readonly statsRequested = output<PostModel>();
  readonly mediaClicked = output<{ items: AttachmentItem[]; index: number }>();

  readonly activeTabCode = signal<string>('');
  readonly searchText = signal<string>('');
  readonly selectedDateKey = signal<string>('');
  readonly rsvpLoadingId = signal<string>('');

  readonly filterTabs = [
    { code: '', label: 'Tất cả' },
    { code: 'hoi-thao', label: 'Sự kiện' },
    { code: 'thong-bao', label: 'Thông báo' },
    { code: 'dao-tao', label: 'Đào tạo nội bộ' },
    { code: 'lich-nghi', label: 'Lịch nghỉ' },
  ];

  readonly filteredPosts = computed(() => {
    let list = [...this.posts()];
    const tab = this.activeTabCode();
    if (tab) list = list.filter((p) => p.categoryCode === tab);
    const kw = this.searchText().trim().toLowerCase();
    if (kw) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(kw) ||
          JSON.stringify(p.content || '').toLowerCase().includes(kw),
      );
    }
    const dateKey = this.selectedDateKey();
    if (dateKey) {
      const ddmm = dateKey.slice(0, 5);
      list = list.filter(
        (p) =>
          JSON.stringify(p.content || '').includes(ddmm) ||
          (p.eventStartsAt || '').includes(dateKey.split('/').reverse().join('-')),
      );
    }
    return list;
  });

  getBodyText(post: PostModel): string {
    if (post.content && typeof post.content === 'object') {
      return String(post.content['what'] || post.content['body'] || '');
    }
    return typeof post.content === 'string' ? post.content : '';
  }

  getWhenText(post: PostModel): string {
    if (post.content && typeof post.content === 'object' && post.content['when']) {
      return String(post.content['when']);
    }
    return post.eventStartsAt ? formatRelativeDate(post.eventStartsAt) : '';
  }

  getWhereText(post: PostModel): string {
    if (post.content && typeof post.content === 'object' && post.content['where']) {
      return String(post.content['where']);
    }
    return '';
  }

  getJoinLink(post: PostModel): string {
    if (post.content && typeof post.content === 'object' && post.content['link']) {
      return String(post.content['link']);
    }
    return '';
  }

  getCategoryPillLabel(code?: string | null): string {
    const found = this.filterTabs.find((t) => t.code === code);
    return found ? found.label : 'Sự kiện';
  }

  formatTime(iso?: string | null): string {
    return formatRelativeDate(iso);
  }

  formatSize(bytes: number): string {
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

  onScheduleItemClick(ev: UpcomingScheduleEventItem): void {
    const el = document.getElementById(`post-${ev.postId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  async onToggleRsvp(post: PostModel): Promise<void> {
    if (this.rsvpLoadingId() === post.id) return;
    if (post.isRegistered && !confirm(`Bạn muốn hủy đăng ký tham gia "${post.title}"?`)) {
      return;
    }
    this.rsvpLoadingId.set(post.id);
    try {
      if (post.isRegistered) {
        await this.api.cancelEventRegistration(post.id);
        this.postUpdated.emit({
          ...post,
          isRegistered: false,
          registeredCount: Math.max(0, (post.registeredCount || 1) - 1),
        });
        this.message.info('Đã hủy đăng ký tham gia sự kiện');
      } else {
        await this.api.registerEvent(post.id);
        this.postUpdated.emit({
          ...post,
          isRegistered: true,
          registeredCount: (post.registeredCount || 0) + 1,
        });
        this.message.success('Đăng ký tham gia sự kiện thành công!');
      }
    } finally {
      this.rsvpLoadingId.set('');
    }
  }

  async onToggleHeart(post: PostModel): Promise<void> {
    const next = !post.isHearted;
    const count = Math.max(0, (post.heartCount || 0) + (next ? 1 : -1));
    this.postUpdated.emit({ ...post, isHearted: next, heartCount: count });
    await this.api.toggleHeart(post.id);
  }
}
