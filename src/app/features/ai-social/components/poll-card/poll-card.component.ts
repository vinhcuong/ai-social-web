import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PollModel, PollOptionItem } from '../../../../core/models/ai-social.models';
import { AiSocialApiService } from '../../services/ai-social-api.service';

@Component({
  selector: 'app-poll-card',
  standalone: true,
  imports: [NzButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="poll-box">
      <div class="poll-header">
        <span class="poll-badge">Khảo sát ý kiến</span>
        <span class="poll-meta">
          {{ poll().allowMultiple ? 'Chọn nhiều phương án' : 'Chọn 1 phương án' }} ·
          {{ poll().totalVotes || 0 }} lượt bình chọn
        </span>
      </div>

      <h4 class="poll-question">{{ poll().question }}</h4>

      <div class="poll-options">
        @for (opt of poll().options; track opt.id) {
          <button
            type="button"
            class="poll-option-item"
            [class.selected]="isSelected(opt)"
            [disabled]="!!poll().isClosed || submitting()"
            (click)="toggleOption(opt.id)"
          >
            <div class="progress-fill" [style.width.%]="getPercentage(opt)"></div>
            <div class="option-content">
              <span class="option-text">
                <span class="check-dot" [class.checked]="isSelected(opt)"></span>
                {{ opt.text }}
              </span>
              <span class="option-stat">{{ getPercentage(opt) }}% ({{ opt.voteCount || 0 }})</span>
            </div>
          </button>
        }
      </div>

      @if (!poll().isClosed) {
        <div class="poll-actions">
          <button
            type="button"
            nz-button
            nzType="primary"
            nzSize="small"
            [nzLoading]="submitting()"
            [disabled]="selectedIds().length === 0"
            (click)="submitVote()"
          >
            Gửi bình chọn
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .poll-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-top: 12px; }
    .poll-header {
      display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
      .poll-badge { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #0284c7; background: #e0f2fe; padding: 2px 8px; border-radius: 999px; }
      .poll-meta { font-size: 12px; color: #64748b; }
    }
    .poll-question { font-size: 15px; font-weight: 600; color: #0f172a; margin: 0 0 12px; }
    .poll-options { display: flex; flex-direction: column; gap: 8px; }
    .poll-option-item {
      position: relative; width: 100%; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 10px;
      padding: 10px 14px; text-align: left; overflow: hidden; cursor: pointer; transition: border-color 0.15s ease;
      &.selected { border-color: #0066b3; font-weight: 600; }
      .progress-fill { position: absolute; left: 0; top: 0; bottom: 0; background: rgba(0, 102, 179, 0.1); transition: width 0.25s ease; }
      .option-content { position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 14px; color: #0f172a; }
      .option-text { display: flex; align-items: center; gap: 8px; }
      .check-dot {
        width: 14px; height: 14px; border-radius: 50%; border: 2px solid #94a3b8; display: inline-block;
        &.checked { border-color: #0066b3; background: #0066b3; }
      }
      .option-stat { font-size: 12px; color: #475569; white-space: nowrap; }
    }
    .poll-actions { margin-top: 12px; display: flex; justify-content: flex-end; }
  `],
})
export class PollCardComponent {
  private readonly api = inject(AiSocialApiService);
  private readonly message = inject(NzMessageService);

  readonly postId = input.required<string>();
  readonly poll = input.required<PollModel>();
  readonly pollUpdated = output<PollModel>();

  readonly submitting = signal(false);
  readonly localSelectedIds = signal<string[] | null>(null);

  readonly selectedIds = computed(() => {
    const local = this.localSelectedIds();
    if (local !== null) return local;
    const p = this.poll();
    if (p.myVotedOptionIds?.length) return p.myVotedOptionIds;
    return p.options.filter((o) => o.isVoted).map((o) => o.id);
  });

  isSelected(opt: PollOptionItem): boolean {
    return this.selectedIds().includes(opt.id);
  }

  getPercentage(opt: PollOptionItem): number {
    if (typeof opt.percentage === 'number') return Math.round(opt.percentage);
    const total = this.poll().totalVotes || 0;
    if (total <= 0) return 0;
    return Math.round(((opt.voteCount || 0) / total) * 100);
  }

  toggleOption(optionId: string): void {
    const current = [...this.selectedIds()];
    if (this.poll().allowMultiple) {
      const idx = current.indexOf(optionId);
      if (idx >= 0) current.splice(idx, 1);
      else current.push(optionId);
      this.localSelectedIds.set(current);
    } else {
      this.localSelectedIds.set([optionId]);
    }
  }

  async submitVote(): Promise<void> {
    const ids = this.selectedIds();
    if (!ids.length) return;
    this.submitting.set(true);
    try {
      const updated = await this.api.votePoll(this.postId(), ids);
      if (updated) {
        this.pollUpdated.emit(updated);
        this.localSelectedIds.set(null);
      }
      this.message.success('Đã ghi nhận bình chọn của bạn');
    } catch (e: any) {
      this.message.error(e?.error?.message || 'Không thể gửi bình chọn');
    } finally {
      this.submitting.set(false);
    }
  }
}
