import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { ChannelCode } from '../../../../core/constants/storage-keys';
import { AttachmentItem, PostModel } from '../../../../core/models/ai-social.models';
import { MediaLightboxModalComponent } from '../../components/media-lightbox-modal/media-lightbox-modal.component';
import { PostStatsModalComponent } from '../../components/post-stats-modal/post-stats-modal.component';
import { AiSocialShareModalComponent } from '../../components/share-modal/ai-social-share-modal.component';
import { AiSocialStateService } from '../../services/ai-social-state.service';
import { EmergencyChannelViewComponent } from '../channels/emergency-channel-view/emergency-channel-view.component';
import { EventChannelViewComponent } from '../channels/event-channel-view/event-channel-view.component';
import { HandbookChannelViewComponent } from '../channels/handbook-channel-view/handbook-channel-view.component';
import { MediaChannelViewComponent } from '../channels/media-channel-view/media-channel-view.component';

@Component({
  selector: 'app-channel-feed-page',
  standalone: true,
  imports: [
    EmergencyChannelViewComponent,
    EventChannelViewComponent,
    MediaChannelViewComponent,
    HandbookChannelViewComponent,
    AiSocialShareModalComponent,
    MediaLightboxModalComponent,
    PostStatsModalComponent,
  ],
  templateUrl: './channel-feed-page.component.html',
  styleUrls: ['./channel-feed-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelFeedPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  readonly state = inject(AiSocialStateService);

  readonly channelCode = signal<ChannelCode>('khan');
  readonly highlightId = signal<string | null>(null);

  readonly sharingPost = signal<PostModel | null>(null);
  readonly statsModalPost = signal<PostModel | null>(null);
  readonly lightboxMedia = signal<{ items: AttachmentItem[]; index: number } | null>(null);

  ngOnInit(): void {
    combineLatest([this.route.paramMap, this.route.queryParamMap]).subscribe(
      async ([params, query]) => {
        const rawCode = (params.get('channelCode') || 'khan') as ChannelCode;
        const validCode: ChannelCode = ['khan', 'sukien', 'truyenthong', 'sotay'].includes(rawCode)
          ? rawCode
          : 'khan';

        const hlId = query.get('highlightId');
        this.highlightId.set(hlId);

        if (this.channelCode() !== validCode || this.state.posts().length === 0) {
          this.channelCode.set(validCode);
          await this.state.loadChannelPosts(validCode, true);
        }

        if (hlId) {
          setTimeout(() => {
            const el = document.getElementById(`post-${hlId}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 150);
        }
      },
    );
  }

  onPostCreated(created: PostModel): void {
    this.state.prependPost(created);
    this.state.refreshBadges();
  }

  onPostUpdated(updated: PostModel): void {
    this.state.updatePostInList(updated);
    this.state.refreshBadges();
  }

  onPostDeleted(postId: string): void {
    this.state.removePostFromList(postId);
    this.state.refreshBadges();
  }
}
