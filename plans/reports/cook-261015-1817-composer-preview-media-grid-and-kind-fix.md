# Cook Report: Composer Media Preview, Post Media Collage Grid & Attachment `kind` Fix

- **Date**: 2026-10-15 18:17
- **Project**: `ai-social-web` (VNPT AI Social Web)
- **Status**: Completed & Verified (`npm run build` passed with 0 errors)

---

## 1. Summary of Changes

### Issue 1: Composer Image/Video Preview (`InlineComposerCardComponent`)
- **Files**:
  - `src/app/features/ai-social/components/composer/inline-composer-card/inline-composer-card.component.ts`
  - `src/app/features/ai-social/components/composer/inline-composer-card/inline-composer-card.component.html`
  - `src/app/features/ai-social/components/composer/inline-composer-card/inline-composer-card.component.scss`
- **Changes**:
  - Added `mediaAttachments` (`kind === 'image' || kind === 'video'`) and `fileAttachments` (`kind === 'file'`) computed signals.
  - Moved `.composer-attachments-zone` outside `@if (expanded())` so selecting images/videos/files from the collapsed composer bar displays previews immediately.
  - Rendered `.composer-media-strip` (`76×76px` `border-radius: 8px` thumbnails with `object-fit: cover`, upload progress overlay, `▶ Video` badge, and top-right `✕` remove button) separately from `.attachment-preview-strip` (document rows).
  - Updated `submitPost()` to call `resetForm(false)` so local blob preview URLs remain valid for immediate optimistic rendering in the feed.

### Issue 2: Post Card Media Collage Grid vs Document Attachments (`EmergencyChannelViewComponent` & `EventChannelViewComponent`)
- **Files**:
  - `src/app/features/ai-social/views/channels/emergency-channel-view/emergency-channel-view.component.{ts,html,scss}`
  - `src/app/features/ai-social/views/channels/event-channel-view/event-channel-view.component.{ts,html,scss}`
  - `src/app/features/ai-social/views/channel-feed-page/channel-feed-page.component.html`
- **Changes**:
  - Added `getMediaAttachments(post)` and `getDocumentAttachments(post)` using `isImageAttachment(att)` / `isVideoAttachment(att)`.
  - Rendered `mediaAttachments` as a responsive **Media Collage Grid** (`.emerg-media-grid` / `.ev-media-grid`) supporting 1, 2, 3, and 4+ media tiles (`+N` overlay badge on the 4th tile), wired via `(mediaClicked)="lightboxMedia.set($event)"` to `MediaLightboxModalComponent`.
  - Restricted the `Đính kèm:` `.figma-file-box` / `.ev-attachments-row` section strictly to `documentAttachments` (e.g., `.pdf`, `.docx`, `.xlsx`).

### Issue 3: Fix Backend `500 post_attachments_kind_check` & Auto-Publish Draft (`AiSocialS3UploadService`, `post-format.util.ts`, `AiSocialApiService`)
- **Files**:
  - `src/app/core/models/ai-social.models.ts`
  - `src/app/features/ai-social/services/ai-social-s3-upload.service.ts`
  - `src/app/features/ai-social/utils/post-format.util.ts`
  - `src/app/features/ai-social/services/ai-social-api.service.ts`
- **Changes**:
  - Updated `detectKind()` and `AttachmentItem.kind` from `'document'` to `'file'` to satisfy PostgreSQL `CHECK (kind = ANY (ARRAY['image', 'file', 'video']))`.
  - Updated `AiSocialApiService.createPost()` to call `POST /api/v1/posts` followed by `POST /api/v1/posts/:id/publish` (matching Mobile `InlineComposerSubmitHandler.submit`), and rethrow HTTP `>= 400` errors instead of silently falling back to a fake local post.

### Issue 4: Urgent vs Normal Post Classification in `EmergencyChannelViewComponent`
- **Files**:
  - `src/app/features/ai-social/views/channels/emergency-channel-view/emergency-channel-view.component.ts`
  - `src/app/features/ai-social/components/composer/inline-composer-card/inline-composer-card.component.ts`
- **Changes**:
  - Synchronized `isUrgentBroadcast(post)` with Mobile `EmergencyPostHeader.isUrgent` (`!!post.isMandatory || hasCategory || !!this.getDeadlineText(post)`) and ignored default action `'Xem hướng dẫn chi tiết và triển khai ngay.'` in `hasDistinctAction(post)`.
  - Aligned `emergencyTags` codes with backend (`thien_tai`, `dich_benh`, `ha_tang_cntt`, `an_ninh`).

---

## 2. Verification
- Production build (`npm run build`) completed in `2.62s` with **0 errors**.
- All modified code files in `src/app/` are under the 200-line limit.
