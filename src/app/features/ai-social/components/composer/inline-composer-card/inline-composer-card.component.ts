import { ChangeDetectionStrategy, Component, OnDestroy, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ChannelCode } from '../../../../../core/constants/storage-keys';
import { AttachmentItem, ChannelCategoryModel, PostModel, PublishableUnitNode } from '../../../../../core/models/ai-social.models';
import { AiSocialAuthService } from '../../../../../core/services/ai-social-auth.service';
import { AppIcon } from '../../../../../shared/icon/icon';
import { AiSocialApiService } from '../../../services/ai-social-api.service';
import { AiSocialS3UploadService, ComposerPendingAttachment } from '../../../services/ai-social-s3-upload.service';
import { buildComposerPostPayload, formatFileSize } from '../../../utils/post-format.util';

@Component({
  selector: 'app-inline-composer-card',
  standalone: true,
  imports: [FormsModule, NzInputModule, NzButtonComponent, NzCheckboxComponent, AppIcon],
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
  readonly submitting = signal(false);
  readonly title = signal('');
  readonly body = signal('');
  readonly whatHappened = signal('');
  readonly actionRequired = signal('');
  readonly deadlineText = signal('');
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

  readonly canPublish = computed(() => this.auth.canPublishInChannel(this.channelCode()));

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

  onFilesSelected(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const files = Array.from(inputEl.files || []);
    if (!files.length) return;
    const current = [...this.attachments()];
    for (const file of files) {
      const err = this.uploader.validateFile(file);
      if (err) {
        this.message.warning(err);
        continue;
      }
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

  addPollOption(): void {
    if (this.pollOptions().length < 10) this.pollOptions.update((opts) => [...opts, '']);
  }

  updatePollOption(index: number, value: string): void {
    this.pollOptions.update((opts) => opts.map((o, i) => (i === index ? value : o)));
  }

  removePollOption(index: number): void {
    if (this.pollOptions().length > 2) {
      this.pollOptions.update((opts) => opts.filter((_, i) => i !== index));
    }
  }

  toggleUnit(unitId: string): void {
    this.selectedUnitIds.update((ids) =>
      ids.includes(unitId) ? ids.filter((id) => id !== unitId) : [...ids, unitId],
    );
  }

  sizeText(bytes: number): string {
    return formatFileSize(bytes);
  }

  async submitPost(): Promise<void> {
    if (!this.title().trim()) {
      this.message.warning('Vui lòng nhập tiêu đề bài viết');
      return;
    }
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
        channelCode: this.channelCode(),
        title: this.title(),
        body: this.body(),
        whatHappened: this.whatHappened(),
        actionRequired: this.actionRequired(),
        deadlineText: this.deadlineText(),
        eventLocation: this.eventLocation(),
        eventStartsAt: this.eventStartsAt(),
        eventEndsAt: this.eventEndsAt(),
        requireRegistration: this.requireRegistration(),
        maxAttendees: this.maxAttendees(),
        categoryCode: this.categoryCode(),
        chapterCode: this.chapterCode(),
        isMandatory: this.isMandatory(),
        audienceAll: this.audienceAll(),
        selectedUnitIds: this.selectedUnitIds(),
        hasPoll: this.hasPoll(),
        pollQuestion: this.pollQuestion(),
        pollAllowMultiple: this.pollAllowMultiple(),
        pollOptions: this.pollOptions(),
        attachments: uploadedAttachments,
      });
      const created = await this.api.createPost(payload);
      this.postCreated.emit(created);
      this.resetForm();
      this.message.success('Đăng bài thành công!');
    } catch (e: any) {
      this.message.error(e?.error?.message || e?.message || 'Không thể đăng bài viết');
    } finally {
      this.submitting.set(false);
    }
  }

  resetForm(): void {
    this.attachments().forEach((a) => this.uploader.revokePreview(a));
    this.attachments.set([]);
    this.title.set('');
    this.body.set('');
    this.whatHappened.set('');
    this.actionRequired.set('');
    this.deadlineText.set('');
    this.eventLocation.set('');
    this.eventStartsAt.set('');
    this.eventEndsAt.set('');
    this.requireRegistration.set(false);
    this.maxAttendees.set(null);
    this.hasPoll.set(false);
    this.pollQuestion.set('');
    this.pollOptions.set(['', '']);
    this.expanded.set(false);
  }

  ngOnDestroy(): void {
    this.attachments().forEach((a) => this.uploader.revokePreview(a));
  }
}
