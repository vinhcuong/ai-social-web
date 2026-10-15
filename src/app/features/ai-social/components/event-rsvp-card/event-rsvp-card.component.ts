import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PostModel } from '../../../../core/models/ai-social.models';
import { AiSocialApiService } from '../../services/ai-social-api.service';
import { formatRelativeDate } from '../../utils/post-format.util';

@Component({
  selector: 'app-event-rsvp-card',
  standalone: true,
  imports: [NzButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="event-meta-card">
      <div class="event-info-grid">
        @if (eventTimeLabel()) {
          <div class="info-item">
            <span class="label">Thời gian:</span>
            <span class="value">{{ eventTimeLabel() }}</span>
          </div>
        }
        @if (eventLocationLabel()) {
          <div class="info-item">
            <span class="label">Địa điểm:</span>
            <span class="value">{{ eventLocationLabel() }}</span>
          </div>
        }
        @if (post().requireRegistration) {
          <div class="info-item">
            <span class="label">Đã đăng ký:</span>
            <span class="value highlight">
              {{ post().registeredCount || 0 }}
              @if (post().maxAttendees) {
                / {{ post().maxAttendees }}
              }
              nhân sự
            </span>
          </div>
        }
      </div>

      @if (post().requireRegistration) {
        <div class="rsvp-action-bar">
          @if (post().isRegistered) {
            <span class="registered-pill">✓ Bạn đã đăng ký tham gia sự kiện này</span>
            <button
              type="button"
              nz-button
              nzDanger
              nzSize="small"
              [nzLoading]="loading()"
              (click)="onCancelRegistration()"
            >
              Hủy đăng ký
            </button>
          } @else {
            <button
              type="button"
              nz-button
              nzType="primary"
              [nzLoading]="loading()"
              (click)="onRegister()"
            >
              Đăng ký tham dự sự kiện
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .event-meta-card {
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      border-radius: 12px;
      padding: 14px 16px;
      margin-top: 12px;
    }
    .event-info-grid {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 13px;

      .info-item {
        display: flex;
        gap: 8px;
      }
      .label {
        font-weight: 600;
        color: #0369a1;
        min-width: 85px;
      }
      .value {
        color: #0f172a;
        &.highlight {
          font-weight: 600;
          color: #0284c7;
        }
      }
    }
    .rsvp-action-bar {
      margin-top: 12px;
      padding-top: 10px;
      border-top: 1px dashed #bae6fd;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;

      .registered-pill {
        font-size: 13px;
        font-weight: 600;
        color: #16a34a;
      }
    }
  `],
})
export class EventRsvpCardComponent {
  private readonly api = inject(AiSocialApiService);
  private readonly message = inject(NzMessageService);

  readonly post = input.required<PostModel>();
  readonly rsvpChanged = output<PostModel>();

  readonly loading = signal(false);

  readonly eventTimeLabel = computed(() => {
    const p = this.post();
    if (p.eventStartsAt) return formatRelativeDate(p.eventStartsAt);
    if (p.content && typeof p.content === 'object' && p.content['when']) {
      const w = p.content['when'];
      return typeof w === 'object' ? `${w.start || ''} - ${w.end || ''}` : String(w);
    }
    return '';
  });

  readonly eventLocationLabel = computed(() => {
    const p = this.post();
    if (p.content && typeof p.content === 'object' && p.content['where']) {
      const loc = p.content['where'];
      return typeof loc === 'object'
        ? String(loc.place || loc.address || loc.location || '')
        : String(loc);
    }
    return '';
  });

  async onRegister(): Promise<void> {
    const p = this.post();
    this.loading.set(true);
    try {
      const reg = await this.api.registerEvent(p.id);
      this.rsvpChanged.emit({
        ...p,
        isRegistered: true,
        registeredCount: (p.registeredCount || 0) + 1,
        myRegistration: reg,
      });
      this.message.success('Đăng ký tham gia sự kiện thành công');
    } catch (e: any) {
      this.message.error(e?.error?.message || 'Không thể đăng ký tham gia sự kiện');
    } finally {
      this.loading.set(false);
    }
  }

  async onCancelRegistration(): Promise<void> {
    const p = this.post();
    this.loading.set(true);
    try {
      await this.api.cancelEventRegistration(p.id);
      this.rsvpChanged.emit({
        ...p,
        isRegistered: false,
        registeredCount: Math.max(0, (p.registeredCount || 1) - 1),
        myRegistration: null,
      });
      this.message.info('Đã hủy đăng ký tham gia sự kiện');
    } catch (e: any) {
      this.message.error(e?.error?.message || 'Không thể hủy đăng ký sự kiện');
    } finally {
      this.loading.set(false);
    }
  }
}
