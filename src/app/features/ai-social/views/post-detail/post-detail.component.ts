import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { AttachmentItem, PostModel } from '../../../../core/models/ai-social.models';
import { MediaLightboxModalComponent } from '../../components/media-lightbox-modal/media-lightbox-modal.component';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { AiSocialShareModalComponent } from '../../components/share-modal/ai-social-share-modal.component';
import { AiSocialApiService } from '../../services/ai-social-api.service';
import { AiSocialStateService } from '../../services/ai-social-state.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
    NzButtonComponent,
    PostCardComponent,
    AiSocialShareModalComponent,
    MediaLightboxModalComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="post-detail-page">
      <div class="back-row">
        <button type="button" nz-button nzType="default" (click)="goBack()">
          ← Quay lại bảng tin
        </button>
      </div>

      @if (loading()) {
        <div class="detail-loading">Đang tải nội dung bài viết...</div>
      } @else if (errorMsg()) {
        <div class="detail-error">
          <h3>Không tìm thấy bài viết</h3>
          <p>{{ errorMsg() }}</p>
          <button type="button" nz-button nzType="primary" (click)="goBack()">
            Về trang chủ
          </button>
        </div>
      } @else if (post(); as p) {
        <app-post-card
          [post]="p"
          (postChanged)="onPostChanged($event)"
          (postDeleted)="goBack()"
          (shareRequested)="sharingPost.set($event)"
          (mediaClicked)="lightboxMedia.set($event)"
        />
      }
    </div>

    @if (sharingPost(); as sp) {
      <app-ai-social-share-modal
        [visible]="true"
        [post]="sp"
        (visibleChange)="!$event && sharingPost.set(null)"
      />
    }

    @if (lightboxMedia(); as media) {
      <app-media-lightbox-modal
        [visible]="true"
        [items]="media.items"
        [activeIndex]="media.index"
        (visibleChange)="!$event && lightboxMedia.set(null)"
      />
    }
  `,
  styles: [`
    .post-detail-page {
      max-width: 740px;
      margin: 0 auto;
      padding: 24px 20px 64px;
    }
    .back-row {
      margin-bottom: 16px;
    }
    .detail-loading,
    .detail-error {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 40px 24px;
      text-align: center;
      color: #475569;
    }
  `],
})
export class PostDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(AiSocialApiService);
  private readonly state = inject(AiSocialStateService);

  readonly post = signal<PostModel | null>(null);
  readonly loading = signal<boolean>(true);
  readonly errorMsg = signal<string>('');
  readonly sharingPost = signal<PostModel | null>(null);
  readonly lightboxMedia = signal<{ items: AttachmentItem[]; index: number } | null>(null);

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (params) => {
      const postId = params.get('postId');
      const code = params.get('code');
      this.loading.set(true);
      this.errorMsg.set('');
      try {
        if (code) {
          const loaded = await this.api.getPostByCode(code);
          this.post.set(loaded);
        } else if (postId) {
          const loaded = await this.api.getPostDetail(postId);
          this.post.set(loaded);
        } else {
          this.errorMsg.set('Đường dẫn bài viết không hợp lệ.');
        }
      } catch (e: any) {
        this.errorMsg.set(e?.error?.message || 'Bài viết không tồn tại hoặc bạn không có quyền xem.');
      } finally {
        this.loading.set(false);
      }
    });
  }

  onPostChanged(updated: PostModel): void {
    this.post.set(updated);
    this.state.updatePostInList(updated);
  }

  goBack(): void {
    const ch = this.post()?.channelCode || 'truyenthong';
    this.router.navigate(['/channels', ch]);
  }
}
