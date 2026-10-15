import { Injectable, inject } from '@angular/core';
import { ChannelCode } from '../../../core/constants/storage-keys';
import { AttachmentItem } from '../../../core/models/ai-social.models';
import { AiSocialApiService } from './ai-social-api.service';

export interface ComposerPendingAttachment {
  localId: string;
  file: File;
  fileName: string;
  fileSize: number;
  mimeType: string;
  kind: 'image' | 'video' | 'document';
  previewUrl: string | null;
  progress: number;
  uploading: boolean;
  uploadedItem?: AttachmentItem;
  error?: string;
}

const MAX_IMAGE_BYTES = 20 * 1024 * 1024; // 20 MB
const MAX_DOC_BYTES = 50 * 1024 * 1024; // 50 MB
const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100 MB

@Injectable({
  providedIn: 'root',
})
export class AiSocialS3UploadService {
  private readonly api = inject(AiSocialApiService);

  detectKind(file: File): 'image' | 'video' | 'document' {
    const mime = (file.type || '').toLowerCase();
    const name = file.name.toLowerCase();
    if (mime.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp)$/.test(name)) {
      return 'image';
    }
    if (mime.startsWith('video/') || /\.(mp4|mov|webm)$/.test(name)) {
      return 'video';
    }
    return 'document';
  }

  validateFile(file: File): string | null {
    const kind = this.detectKind(file);
    if (kind === 'image' && file.size > MAX_IMAGE_BYTES) {
      return `Ảnh "${file.name}" vượt quá giới hạn 20MB.`;
    }
    if (kind === 'video' && file.size > MAX_VIDEO_BYTES) {
      return `Video "${file.name}" vượt quá giới hạn 100MB.`;
    }
    if (kind === 'document' && file.size > MAX_DOC_BYTES) {
      return `Tệp "${file.name}" vượt quá giới hạn 50MB.`;
    }
    return null;
  }

  createPendingAttachment(file: File): ComposerPendingAttachment {
    const kind = this.detectKind(file);
    const previewUrl =
      kind === 'image' || kind === 'video' ? URL.createObjectURL(file) : null;

    return {
      localId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type || 'application/octet-stream',
      kind,
      previewUrl,
      progress: 0,
      uploading: false,
    };
  }

  revokePreview(item: ComposerPendingAttachment): void {
    if (item.previewUrl) {
      URL.revokeObjectURL(item.previewUrl);
    }
  }

  async uploadFileToS3(
    pending: ComposerPendingAttachment,
    channelCode: ChannelCode,
    onProgress?: (percent: number) => void,
  ): Promise<AttachmentItem> {
    const presigned = await this.api.createUploadUrl({
      filename: pending.fileName,
      mimeType: pending.mimeType,
      sizeBytes: pending.fileSize,
      channelCode,
      kind: pending.kind,
    });

    await this.putBlobWithProgress(
      presigned.uploadUrl,
      pending.file,
      pending.mimeType,
      onProgress,
    );

    const mediaId = presigned.mediaId || presigned.id || pending.localId;
    const s3Key = presigned.s3Key || presigned.fileUrl || '';

    return {
      id: mediaId,
      fileName: pending.fileName,
      fileUrl: presigned.fileUrl || s3Key,
      fileType: pending.mimeType,
      fileSize: pending.fileSize,
      s3Key,
      kind: pending.kind,
    };
  }

  private putBlobWithProgress(
    uploadUrl: string,
    file: File,
    mimeType: string,
    onProgress?: (percent: number) => void,
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadUrl, true);
      xhr.setRequestHeader('Content-Type', mimeType);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          onProgress?.(100);
          resolve();
        } else {
          reject(new Error(`Tải tệp lên S3 thất bại (HTTP ${xhr.status})`));
        }
      };

      xhr.onerror = () => reject(new Error('Lỗi kết nối khi tải tệp lên kho lưu trữ S3'));
      xhr.send(file);
    });
  }
}
