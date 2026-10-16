import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HandbookPdfBookmark, HandbookTocChapter } from '../../../../../core/models/ai-social.models';
import { AiSocialHostBridgeService } from '../../../../../core/services/ai-social-host-bridge.service';
import { AiSocialApiService } from '../../../services/ai-social-api.service';

@Component({
  selector: 'app-handbook-channel-view',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './handbook-channel-view.component.html',
  styleUrls: ['./handbook-channel-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HandbookChannelViewComponent implements OnInit {
  private readonly api = inject(AiSocialApiService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly bridge = inject(AiSocialHostBridgeService);
  private readonly message = inject(NzMessageService);

  readonly bookmarks = signal<HandbookPdfBookmark[]>([]);
  readonly chapters = signal<HandbookTocChapter[]>([]);
  readonly searchQuery = signal<string>('');
  readonly currentPage = signal<number>(1);
  readonly totalPages = 34;
  readonly markedReadPages = signal<number[]>([1, 6, 14]);

  readonly filteredBookmarks = computed(() => {
    const kw = this.searchQuery().trim().toLowerCase();
    const all = this.bookmarks();
    if (!kw) return all;
    return all.filter((b) => b.title.toLowerCase().includes(kw));
  });

  readonly isCurrentPageRead = computed(() =>
    this.markedReadPages().includes(this.currentPage()),
  );

  readonly safePdfUrl = computed<SafeResourceUrl>(() => {
    const url = `${this.api.handbookPdfStreamUrl}#page=${this.currentPage()}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  async ngOnInit(): Promise<void> {
    const [bms, toc] = await Promise.all([
      this.api.getHandbookBookmarks(),
      this.api.getHandbookToc(),
    ]);
    this.bookmarks.set(bms || []);
    this.chapters.set(toc?.chapters || []);
  }

  goToPage(page: number): void {
    const clamped = Math.max(1, Math.min(this.totalPages, page));
    this.currentPage.set(clamped);
  }

  prevPage(): void {
    this.goToPage(this.currentPage() - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  async markCurrentPageRead(): Promise<void> {
    const pg = this.currentPage();
    if (!this.markedReadPages().includes(pg)) {
      this.markedReadPages.update((list) => [...list, pg]);
    }
    await this.api.markRead('sotay-post-01', 1);
    this.message.success(`Đã xác nhận đọc trang ${pg} Sổ tay Văn hoá VNPT`);
  }

  downloadPdf(): void {
    this.bridge.openFileViewer(
      this.api.handbookPdfStreamUrl,
      'So-tay-Van-hoa-Doanh-nghiep-VNPT.pdf',
    );
  }
}
