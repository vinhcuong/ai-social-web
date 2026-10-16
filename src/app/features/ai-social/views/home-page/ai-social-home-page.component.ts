import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ChannelCode } from '../../../../core/constants/storage-keys';
import { PostModel } from '../../../../core/models/ai-social.models';
import { UpcomingScheduleEventItem } from '../../../../core/models/ai-social-extended.models';
import { AiSocialStateService } from '../../services/ai-social-state.service';

export interface HomePinnedChannelCardConfig {
  code: ChannelCode;
  title: string;
  subtitle: string;
  bgAsset: string;
  iconAsset: string;
  borderColor: string;
  tagStyle: 'danger' | 'warning' | 'purple' | 'info';
}

@Component({
  selector: 'app-ai-social-home-page',
  standalone: true,
  imports: [],
  templateUrl: './ai-social-home-page.component.html',
  styleUrls: ['./ai-social-home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiSocialHomePageComponent implements OnInit {
  private readonly router = inject(Router);
  readonly state = inject(AiSocialStateService);

  readonly pinnedCards: HomePinnedChannelCardConfig[] = [
    {
      code: 'khan',
      title: 'Thông báo khẩn',
      subtitle: 'Cảnh báo khẩn cấp, chỉ đạo điều hành, yêu cầu xác nhận đã đọc',
      bgAsset: 'assets/ai-social/home/bg-hong.png',
      iconAsset: 'assets/ai-social/home/thong-bao-khan.png',
      borderColor: '#FEEBEC',
      tagStyle: 'danger',
    },
    {
      code: 'sukien',
      title: 'Thông tin sự kiện',
      subtitle: 'Lịch sự kiện, thông báo nhân sự, đào tạo, lịch nghỉ lễ',
      bgAsset: 'assets/ai-social/home/bg-vang.png',
      iconAsset: 'assets/ai-social/home/thong-tin-su-kien.png',
      borderColor: '#FBEDCF',
      tagStyle: 'warning',
    },
    {
      code: 'truyenthong',
      title: 'Truyền thông nội bộ',
      subtitle: 'Chiến dịch truyền thông, câu chuyện văn hóa, vinh danh cá nhân',
      bgAsset: 'assets/ai-social/home/bg-tim.png',
      iconAsset: 'assets/ai-social/home/truyen-thong-noi-bo.png',
      borderColor: '#E5DDF8',
      tagStyle: 'purple',
    },
    {
      code: 'sotay',
      title: 'Sổ tay văn hoá',
      subtitle: 'Quy định, chính sách, sổ tay nhân viên, bài đọc bắt buộc',
      bgAsset: 'assets/ai-social/home/bg-xanh.png',
      iconAsset: 'assets/ai-social/home/so-tay-van-hoa.png',
      borderColor: '#DBE9FF',
      tagStyle: 'info',
    },
  ];

  readonly badges = this.state.badges;
  readonly activeEmergency = this.state.activeEmergencyPost;
  readonly upcomingSchedule = this.state.upcomingSchedule;

  readonly emergencySummaryText = computed(() => {
    const post = this.activeEmergency();
    if (!post) return '';
    if (post.content && typeof post.content === 'object') {
      return String(post.content['action'] || post.content['what'] || post.content['body'] || '');
    }
    return typeof post.content === 'string' ? post.content : '';
  });

  ngOnInit(): void {
    this.state.refreshBadges();
  }

  getBadgeCount(code: ChannelCode): number {
    return this.badges()[code] || 0;
  }

  getBadgeLabel(code: ChannelCode): string {
    const count = this.getBadgeCount(code);
    if (code === 'khan') return count > 0 ? `${count} chưa đọc` : '';
    if (code === 'sukien') return count > 0 ? `${count} tin mới` : '';
    if (code === 'truyenthong') return count > 0 ? `${count} tin mới` : '';
    if (code === 'sotay') return count > 0 ? `${count} bài bắt buộc` : '';
    return '';
  }

  openChannel(code: ChannelCode): void {
    this.router.navigate(['/channels', code]);
  }

  openEmergencyDetail(post: PostModel, event?: Event): void {
    event?.stopPropagation();
    this.router.navigate(['/channels', 'khan'], { queryParams: { highlightId: post.id } });
  }

  openScheduleEvent(ev: UpcomingScheduleEventItem): void {
    this.router.navigate(['/channels', ev.channelCode], {
      queryParams: { highlightId: ev.postId },
    });
  }
}
