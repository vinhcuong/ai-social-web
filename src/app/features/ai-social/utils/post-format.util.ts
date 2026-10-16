import { marked } from 'marked';
import { AttachmentItem, PostModel } from '../../../core/models/ai-social.models';

export function extractPostMarkdownBody(post: PostModel): string {
  const content = post.content;
  if (!content) return '';
  if (typeof content === 'string') return content;
  if (typeof content === 'object') {
    if (post.channelCode === 'khan') {
      const parts: string[] = [];
      if (content['what']) parts.push(`**Chuyện gì đang xảy ra:**\n${content['what']}`);
      if (content['action']) parts.push(`**Cần làm gì ngay:**\n${content['action']}`);
      if (content['deadline']) parts.push(`**Hạn đọc:** ${content['deadline']}`);
      if (content['body'] || content['text']) parts.push(String(content['body'] || content['text']));
      return parts.join('\n\n') || Object.values(content).join('\n\n');
    }
    if (post.channelCode === 'sukien') {
      const parts: string[] = [];
      if (content['what']) parts.push(`**Nội dung:** ${content['what']}`);
      if (content['when']) {
        const w = content['when'];
        parts.push(
          `**Thời gian:** ${typeof w === 'object' ? `${w.start || ''} - ${w.end || ''}` : w}`,
        );
      }
      if (content['where']) {
        const loc = content['where'];
        parts.push(
          `**Địa điểm:** ${
            typeof loc === 'object' ? loc.place || loc.address || loc.location || '' : loc
          }`,
        );
      }
      if (content['who']) parts.push(`**Đối tượng:** ${content['who']}`);
      if (content['action']) parts.push(`**Cần làm:** ${content['action']}`);
      if (content['body']) parts.push(String(content['body']));
      return parts.join('\n\n') || Object.values(content).join('\n\n');
    }
    if (content['body'] || content['markdown'] || content['text']) {
      return String(content['body'] || content['markdown'] || content['text']);
    }
    return Object.values(content)
      .filter((v) => typeof v === 'string')
      .join('\n\n');
  }
  return String(content);
}

export function renderMarkdownToHtml(md: string): string {
  if (!md || !md.trim()) return '';
  try {
    return marked.parse(md, { async: false }) as string;
  } catch {
    return md;
  }
}

export function isImageAttachment(att: AttachmentItem): boolean {
  if (att.kind === 'image') return true;
  const ft = (att.fileType || '').toLowerCase();
  const fn = (att.fileName || '').toLowerCase();
  return ft.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif)$/.test(fn);
}

export function isVideoAttachment(att: AttachmentItem): boolean {
  if (att.kind === 'video') return true;
  const ft = (att.fileType || '').toLowerCase();
  const fn = (att.fileName || '').toLowerCase();
  return ft.startsWith('video/') || /\.(mp4|mov|webm)$/.test(fn);
}

export function isPdfAttachment(att: AttachmentItem): boolean {
  const ft = (att.fileType || '').toLowerCase();
  const fn = (att.fileName || '').toLowerCase();
  return ft.includes('pdf') || fn.endsWith('.pdf');
}

export function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return '';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatRelativeDate(iso?: string | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (isNaN(date.getTime())) return iso;
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSec < 60) return 'Vừa xong';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} phút trước`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} giờ trước`;
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getTargetAudienceLabel(post: PostModel): string {
  if (post.audienceAll) return 'Toàn công ty';
  if (post.audienceSummary?.trim()) return post.audienceSummary.trim();
  if (post.audienceUnits?.length) {
    const first = post.audienceUnits[0].name;
    return post.audienceUnits.length === 1
      ? first
      : `${first} (+${post.audienceUnits.length - 1})`;
  }
  return 'Toàn công ty';
}

export interface ComposerPayloadInput {
  channelCode: string; title: string; body: string; whatHappened: string;
  actionRequired: string; deadlineText: string; eventLocation: string;
  eventStartsAt: string; eventEndsAt: string; requireRegistration: boolean;
  maxAttendees: number | null; categoryCode: string; chapterCode: string;
  isMandatory: boolean; audienceAll: boolean; selectedUnitIds: string[];
  hasPoll: boolean; pollQuestion: string; pollAllowMultiple: boolean;
  pollOptions: string[]; attachments: AttachmentItem[];
  scheduledPublishAt?: string | null;
}

export function getAttachmentMediaUrl(att: AttachmentItem): string {
  return att.thumbnailUrl || att.downloadUrl || att.fileUrl || '';
}

export function buildComposerPostPayload(input: ComposerPayloadInput): Record<string, any> {
  const code = input.channelCode;
  const trimmedWhat = input.whatHappened.trim() || input.body.trim() || input.title.trim();
  const trimmedAction = input.actionRequired.trim();
  const trimmedDeadline = input.deadlineText.trim();

  const contentPayload: Record<string, any> =
    code === 'khan'
      ? {
          what: trimmedWhat,
          action: trimmedAction || 'Xem hướng dẫn chi tiết và triển khai ngay.',
          ...(trimmedDeadline ? { deadline: trimmedDeadline } : {}),
          body: trimmedWhat,
        }
      : code === 'sukien'
        ? {
            what: input.body.trim() || input.title.trim(),
            when: input.eventStartsAt || '',
            where: input.eventLocation.trim(),
            body: input.body.trim(),
          }
        : { body: input.body.trim() };

  const isAll = input.audienceAll || input.selectedUnitIds.length === 0;
  const isUrgentKhan =
    code === 'khan' &&
    Boolean(input.categoryCode.trim() || trimmedDeadline || trimmedAction);
  const isScheduled = Boolean(input.scheduledPublishAt);

  const payload: Record<string, any> = {
    channelCode: code,
    title: input.title.trim(),
    content: contentPayload,
    status: isScheduled ? 'scheduled' : 'published',
    ...(isScheduled ? { scheduledPublishAt: input.scheduledPublishAt } : {}),
    isMandatory: code === 'khan' ? isUrgentKhan : input.isMandatory,
    audienceAll: isAll,
    audienceScope: isAll ? 'all' : 'department',
    audienceUnitIds: isAll ? [] : input.selectedUnitIds,
    targetUnitIds: isAll ? [] : input.selectedUnitIds,
    attachments: input.attachments.map((a) => ({
      id: a.id, fileName: a.fileName, fileUrl: a.fileUrl,
      fileType: a.fileType, mimeType: a.fileType,
      fileSize: a.fileSize, sizeBytes: a.fileSize,
      s3Key: a.s3Key || a.fileUrl,
      kind: a.kind === 'image' || a.kind === 'video' ? a.kind : 'file',
      downloadUrl: a.downloadUrl,
    })),
  };

  if (input.categoryCode) payload['categoryCode'] = input.categoryCode;
  if (input.chapterCode) payload['chapterCode'] = input.chapterCode;
  if (code === 'sukien') {
    if (input.eventStartsAt) payload['eventStartsAt'] = new Date(input.eventStartsAt).toISOString();
    if (input.eventEndsAt) payload['eventEndsAt'] = new Date(input.eventEndsAt).toISOString();
    payload['requireRegistration'] = input.requireRegistration;
    if (input.maxAttendees) payload['maxAttendees'] = Number(input.maxAttendees);
  }
  if (input.hasPoll && input.pollQuestion.trim()) {
    const validOpts = input.pollOptions.map((o) => o.trim()).filter(Boolean);
    if (validOpts.length >= 2) {
      payload['poll'] = {
        question: input.pollQuestion.trim(),
        allowMultiple: input.pollAllowMultiple,
        expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
        options: validOpts.map((text) => ({ text })),
      };
    }
  }
  return payload;
}
