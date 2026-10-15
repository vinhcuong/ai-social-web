import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { AiSocialHostBridgeService } from '../../../../core/services/ai-social-host-bridge.service';
import { AppIcon } from '../../../../shared/icon/icon';
import { AiSocialApiService } from '../../services/ai-social-api.service';

@Component({
  selector: 'app-handbook-pdf-viewer',
  standalone: true,
  imports: [NzButtonComponent, AppIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pdf-viewer-panel">
      <header class="pdf-toolbar">
        <div class="pdf-title-group">
          <app-icon name="files/pdf" [size]="20" [showRoot]="true" />
          <span class="pdf-title">{{ title() || 'Sổ tay văn hoá VNPT (PDF)' }}</span>
          @if (pageNumber(); as pg) {
            <span class="page-pill">Trang {{ pg }}</span>
          }
        </div>
        <div class="pdf-actions">
          <button type="button" nz-button nzSize="small" (click)="openInNewTab()">
            Mở tab mới / Tải xuống
          </button>
        </div>
      </header>

      <div class="pdf-frame-wrapper">
        <iframe
          class="pdf-iframe"
          [src]="safePdfUrl()"
          title="Sổ tay văn hoá PDF Viewer"
        ></iframe>
      </div>
    </div>
  `,
  styles: [`
    .pdf-viewer-panel {
      display: flex;
      flex-direction: column;
      height: calc(100vh - 140px);
      min-height: 560px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      overflow: hidden;
    }
    .pdf-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;

      .pdf-title-group {
        display: flex;
        align-items: center;
        gap: 8px;

        .pdf-title {
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
        }
        .page-pill {
          font-size: 12px;
          font-weight: 600;
          color: #7c3aed;
          background: #f5f3ff;
          padding: 2px 8px;
          border-radius: 999px;
        }
      }
    }
    .pdf-frame-wrapper {
      flex: 1;
      width: 100%;
      background: #334155;

      .pdf-iframe {
        width: 100%;
        height: 100%;
        border: none;
      }
    }
  `],
})
export class HandbookPdfViewerComponent {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly api = inject(AiSocialApiService);
  private readonly bridge = inject(AiSocialHostBridgeService);

  readonly pdfUrl = input<string>('');
  readonly title = input<string>('');
  readonly pageNumber = input<number | null>(null);

  readonly resolvedUrl = computed(() => {
    const base = this.pdfUrl() || this.api.handbookPdfStreamUrl;
    const page = this.pageNumber();
    return page && page > 0 ? `${base}#page=${page}` : base;
  });

  readonly safePdfUrl = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(this.resolvedUrl()),
  );

  openInNewTab(): void {
    this.bridge.openFileViewer(this.resolvedUrl(), this.title() || 'so-tay-van-hoa.pdf');
  }
}
