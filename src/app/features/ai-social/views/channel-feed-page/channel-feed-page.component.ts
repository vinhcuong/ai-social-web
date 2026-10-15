import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CHANNELS_META, ChannelCode } from '../../../../core/constants/storage-keys';
import {
  AttachmentItem,
  HandbookTocArticle,
  PostModel,
} from '../../../../core/models/ai-social.models';
import { AppIcon } from '../../../../shared/icon/icon';
import { InlineComposerCardComponent } from '../../components/composer/inline-composer-card/inline-composer-card.component';
import { HandbookPdfViewerComponent } from '../../components/handbook-pdf-viewer/handbook-pdf-viewer.component';
import { MediaLightboxModalComponent } from '../../components/media-lightbox-modal/media-lightbox-modal.component';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { AiSocialShareModalComponent } from '../../components/share-modal/ai-social-share-modal.component';
import { AiSocialStateService } from '../../services/ai-social-state.service';

@Component({
  selector: 'app-channel-feed-page',
  standalone: true,
  imports: [
    FormsModule,
    NzInputModule,
    NzButtonComponent,
    AppIcon,
    InlineComposerCardComponent,
    PostCardComponent,
    HandbookPdfViewerComponent,
    AiSocialShareModalComponent,
    MediaLightboxModalComponent,
  ],
  templateUrl: './channel-feed-page.component.html',
  styleUrls: ['./channel-feed-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelFeedPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  readonly state = inject(AiSocialStateService);

  readonly channelCode = signal<ChannelCode>('truyenthong');
  readonly sotayViewMode = signal<'feed' | 'pdf'>('feed');
  readonly selectedPdfPage = signal<number | null>(1);
  readonly selectedPdfTitle = signal<string>('Sổ tay văn hoá VNPT');

  readonly sharingPost = signal<PostModel | null>(null);
  readonly lightboxMedia = signal<{ items: AttachmentItem[]; index: number } | null>(null);

  readonly channelMeta = computed(
    () =>
      CHANNELS_META.find((c) => c.code === this.channelCode()) || CHANNELS_META[2],
  );

  readonly pinnedPosts = computed(() =>
    this.state.posts().filter((p) => !!p.pinnedAt),
  );

  readonly upcomingEvents = computed(() =>
    this.state
      .posts()
      .filter((p) => p.channelCode === 'sukien' && !!p.eventStartsAt)
      .slice(0, 5),
  );

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const rawCode = (params.get('channelCode') || 'truyenthong') as ChannelCode;
      const validCode: ChannelCode = ['khan', 'sukien', 'truyenthong', 'sotay'].includes(rawCode)
        ? rawCode
        : 'truyenthong';

      this.channelCode.set(validCode);
      this.state.loadChannelPosts(validCode, true);

      if (validCode === 'sotay') {
        this.state.loadHandbookToc();
      } else {
        this.sotayViewMode.set('feed');
      }
    });
  }

  onSearchSubmit(): void {
    this.state.loadChannelPosts(this.channelCode(), false);
  }

  selectCategory(catCode: string): void {
    const next = this.state.selectedCategory() === catCode ? '' : catCode;
    this.state.selectedCategory.set(next);
    this.state.loadChannelPosts(this.channelCode(), false);
  }

  onPostCreated(created: PostModel): void {
    this.state.prependPost(created);
    this.state.refreshBadges();
  }

  onPostChanged(updated: PostModel): void {
    this.state.updatePostInList(updated);
    this.state.refreshBadges();
    this.state.refreshMyProgress();
  }

  onPostDeleted(postId: string): void {
    this.state.removePostFromList(postId);
    this.state.refreshBadges();
  }

  onSelectTocItem(item: HandbookTocArticle, index: number): void {
    this.selectedPdfTitle.set(item.title);
    this.selectedPdfPage.set(item.pdfPage || index + 1);
    this.sotayViewMode.set('pdf');
  }
}
