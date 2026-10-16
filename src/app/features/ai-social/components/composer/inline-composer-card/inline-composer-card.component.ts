import {
  ChangeDetectionStrategy, Component, OnDestroy, computed, effect, inject, input, output, signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ChannelCode } from '../../../../../core/constants/storage-keys';
import { AttachmentItem, ChannelCategoryModel, PostModel, PublishableUnitNode } from '../../../../../core/models/ai-social.models';
import { AiSocialAuthService } from '../../../../../core/services/ai-social-auth.service';
import { AiSocialApiService } from '../../../services/ai-social-api.service';
import { AiSocialS3UploadService, ComposerPendingAttachment } from '../../../services/ai-social-s3-upload.service';
import { buildComposerPostPayload, formatFileSize } from '../../../utils/post-format.util';
import { EmojiPickerPopoverComponent } from '../emoji-picker-popover/emoji-picker-popover.component';
import { PostScheduleModalComponent } from '../post-schedule-modal/post-schedule-modal.component';

export interface EmergencyTagOption { code: string; label: string; }

@Component({
  selector: 'app-inline-composer-card',
  standalone: true,
  imports: [FormsModule, NzCheckboxComponent, EmojiPickerPopoverComponent, PostScheduleModalComponent],
  templateUrl: './inline-composer-card.component.html',
  styleUrls: ['./inline-composer-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InlineComposerCardComponent implements OnDestroy {
  private readonly api = inject(AiSocialApiService);
  private readonly auth = inject(AiSocialAuthService);
  private readonly uploader = inject(AiSocialS3UploadService);
  private readonly message = inject(NzMessageService);

  readonly channelCode = input.required<ChannelCode>();
  readonly categories = input<ChannelCategoryModel[]>([]);
  readonly postCreated = output<PostModel>();

  readonly expanded = signal(false);
  readonly showTagPicker = signal(false);
  readonly showEmojiPicker = signal(false);
  readonly showScheduleModal = signal(false);
  readonly showAudiencePicker = signal(false);
  readonly submitting = signal(false);

  readonly title = signal('');
  readonly body = signal('');
  readonly whatHappened = signal('');
  readonly actionRequired = signal('');
  readonly activeField = signal<'title' | 'what' | 'action' | 'body'>('what');
  readonly scheduledDate = signal<Date | null>(null);

  readonly eventLocation = signal('');
  readonly eventStartsAt = signal('');
  readonly eventEndsAt = signal('');
  readonly requireRegistration = signal(false);
  readonly maxAttendees = signal<number | null>(null);
  readonly categoryCode = signal('');
  readonly chapterCode = signal('');
  readonly isMandatory = signal(false);
  readonly audienceAll = signal(true);
  readonly availableUnits = signal<PublishableUnitNode[]>([]);
  readonly selectedUnitIds = signal<string[]>([]);
  readonly hasPoll = signal(false);
  readonly pollQuestion = signal('');
  readonly pollAllowMultiple = signal(false);
  readonly pollOptions = signal<string[]>(['', '']);
  readonly attachments = signal<ComposerPendingAttachment[]>([]);

  readonly emergencyTags: EmergencyTagOption[] = [
    { code: 'thien_tai', label: 'Thiên tai & bão lũ' }, { code: 'dich_benh', label: 'Dịch bệnh & Y tế' },
    { code: 'ha_tang_cntt', label: 'Sự cố hạ tầng / Viễn thông' }, { code: 'an_ninh', label: 'An toàn thông tin' },
  ];

  readonly mediaAttachments = computed(() => this.attachments().filter((a) => a.kind === 'image' || a.kind === 'video'));
  readonly fileAttachments = computed(() => this.attachments().filter((a) => a.kind === 'file'));
  readonly canPublish = computed(() => this.auth.canPublishInChannel(this.channelCode()));
  readonly canSubmit = computed(() => this.title().trim().length > 0);
  readonly audienceLabel = computed(() =>
    this.audienceAll() || !this.selectedUnitIds().length ? 'Toàn công ty' : `Đơn vị (${this.selectedUnitIds().length})`,
  );
  readonly submitButtonLabel = computed(() => (this.scheduledDate() ? 'Lên lịch' : 'Đăng bài'));

  constructor() {
    effect(() => {
      const code = this.channelCode();
      if (code === 'khan') this.isMandatory.set(true);
      if (this.canPublish()) this.loadUnits(code);
    });
  }

  private async loadUnits(code: ChannelCode): Promise<void> {
    try {
      const res = await this.api.getPublishableUnits(code);
      this.availableUnits.set(res?.units || []);
    } catch {
      this.availableUnits.set([]);
    }
  }

  toggleTagPicker(): void { this.expanded.set(true); this.showTagPicker.update((v) => !v); }
  toggleAudiencePicker(): void { this.showAudiencePicker.update((v) => !v); }

  onAutoGrow(event: Event): void {
    const el = event.target as HTMLTextAreaElement;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 320)}px`;
  }

  onPickEmoji(emoji: string): void {
    const target = this.activeField(), code = this.channelCode();
    if (target === 'title' || !this.expanded()) this.title.update((v) => `${v}${emoji}`);
    else if (target === 'action') this.actionRequired.update((v) => `${v}${emoji}`);
    else if (code === 'khan') this.whatHappened.update((v) => `${v}${emoji}`);
    else this.body.update((v) => `${v}${emoji}`);
  }

  formatScheduledText(d: Date): string {
    const hh = String(d.getHours()).padStart(2, '0'), mm = String(d.getMinutes()).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0'), mo = String(d.getMonth() + 1).padStart(2, '0');
    return `${hh}:${mm} - ${dd}/${mo}/${d.getFullYear()}`;
  }

  onFilesSelected(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const files = Array.from(inputEl.files || []);
    if (!files.length) return;
    this.expanded.set(true);
    const current = [...this.attachments()];
    for (const file of files) {
      const err = this.uploader.validateFile(file);
      if (err) { this.message.warning(err); continue; }
      current.push(this.uploader.createPendingAttachment(file));
    }
    this.attachments.set(current);
    inputEl.value = '';
  }

  removeAttachment(localId: string): void {
    const target = this.attachments().find((a) => a.localId === localId);
    if (target) this.uploader.revokePreview(target);
    this.attachments.update((list) => list.filter((a) => a.localId !== localId));
  }

  toggleUnit(unitId: string): void {
    this.audienceAll.set(false);
    this.selectedUnitIds.update((ids) => ids.includes(unitId) ? ids.filter((id) => id !== unitId) : [...ids, unitId]);
  }

  sizeText(bytes: number): string { return formatFileSize(bytes); }

  async submitPost(): Promise<void> {
    if (!this.canSubmit()) return;
    this.submitting.set(true);
    try {
      const uploadedAttachments: AttachmentItem[] = [];
      for (const item of this.attachments()) {
        item.uploading = true;
        this.attachments.set([...this.attachments()]);
        const uploaded = await this.uploader.uploadFileToS3(item, this.channelCode(), (pct) => {
          item.progress = pct;
          this.attachments.set([...this.attachments()]);
        });
        uploadedAttachments.push(uploaded);
      }
      const payload = buildComposerPostPayload({
        channelCode: this.channelCode(), title: this.title(), body: this.body(),
        whatHappened: this.whatHappened() || this.body(), actionRequired: this.actionRequired(),
        deadlineText: '', eventLocation: this.eventLocation(),
        eventStartsAt: this.eventStartsAt(), eventEndsAt: this.eventEndsAt(),
        requireRegistration: this.requireRegistration(), maxAttendees: this.maxAttendees(),
        categoryCode: this.categoryCode(), chapterCode: this.chapterCode(),
        isMandatory: this.isMandatory(), audienceAll: this.audienceAll(), selectedUnitIds: this.selectedUnitIds(),
        hasPoll: this.hasPoll(), pollQuestion: this.pollQuestion(), pollAllowMultiple: this.pollAllowMultiple(),
        pollOptions: this.pollOptions(), attachments: uploadedAttachments,
        scheduledPublishAt: this.scheduledDate()?.toISOString() || null,
      });
      const created = await this.api.createPost(payload);
      this.postCreated.emit(created);
      this.resetForm(false);
      this.message.success(this.scheduledDate() ? 'Đã lên lịch bài viết thành công!' : 'Đăng thông báo thành công!');
    } catch (e: any) {
      this.message.error(e?.error?.message || e?.message || 'Không thể đăng bài viết');
    } finally {
      this.submitting.set(false);
    }
  }

  resetForm(revokeBlobs = true): void {
    if (revokeBlobs) this.attachments().forEach((a) => this.uploader.revokePreview(a));
    this.attachments.set([]);
    this.title.set(''); this.body.set(''); this.whatHappened.set(''); this.actionRequired.set('');
    this.categoryCode.set(''); this.scheduledDate.set(null); this.expanded.set(false);
    this.showTagPicker.set(false); this.showEmojiPicker.set(false); this.showScheduleModal.set(false);
  }

  ngOnDestroy(): void {
    this.attachments().forEach((a) => this.uploader.revokePreview(a));
  }
}
