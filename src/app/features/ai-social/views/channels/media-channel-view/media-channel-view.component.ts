import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AttachmentItem, ChannelCategoryModel, PostModel } from '../../../../../core/models/ai-social.models';
import { InlineComposerCardComponent } from '../../../components/composer/inline-composer-card/inline-composer-card.component';
import { PostCardComponent } from '../../../components/post-card/post-card.component';

@Component({
  selector: 'app-media-channel-view',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    InlineComposerCardComponent,
    PostCardComponent,
  ],
  templateUrl: './media-channel-view.component.html',
  styleUrls: ['./media-channel-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaChannelViewComponent {
  readonly posts = input.required<PostModel[]>();
  readonly categories = input<ChannelCategoryModel[]>([]);
  readonly loading = input<boolean>(false);
  readonly highlightId = input<string | null>(null);

  readonly postCreated = output<PostModel>();
  readonly postUpdated = output<PostModel>();
  readonly postDeleted = output<string>();
  readonly shareRequested = output<PostModel>();
  readonly mediaClicked = output<{ items: AttachmentItem[]; index: number }>();

  readonly showCampaignHero = signal<boolean>(true);
  readonly selectedPillCode = signal<string>('');
  readonly searchText = signal<string>('');

  readonly filterPills = [
    { code: '', label: 'Tất cả' },
    { code: 'chien-dich', label: 'Chiến dịch' },
    { code: 'cau-chuyen', label: 'Câu chuyện' },
    { code: 'vinh-danh', label: 'Vinh danh' },
  ];

  readonly filteredPosts = computed(() => {
    let list = [...this.posts()];
    const code = this.selectedPillCode();
    if (code) {
      list = list.filter((p) => p.categoryCode === code);
    }
    const kw = this.searchText().trim().toLowerCase();
    if (kw) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(kw) ||
          JSON.stringify(p.content || '').toLowerCase().includes(kw),
      );
    }
    return list;
  });
}
