# Debugger Report: Khôi phục chức năng Đánh dấu đã đọc trên Kênh Thông báo khẩn (`khan`)

- **Date**: 2026-10-15 18:23
- **Project**: `ai-social-web`
- **Status**: Fixed & Verified

---

## 1. Root Cause Analysis

1. **Điều kiện hiển thị nút trong `emergency-channel-view.component.html`**:
   - Trước đây template chỉ hiển thị nút khi `@if (post.isMandatory && !post.isRead)`.
   - Đa số các bài viết khẩn trên hệ thống (đặc biệt các bài tạo từ Mobile qua `InlineComposerSubmitHandler` có `categoryCode`, `deadline` hoặc `action` nhưng không gửi cờ `isMandatory: true`) có `post.isMandatory === false` trong DB, khiến nút **Xác nhận đã đọc** bị ẩn hoàn toàn.
   - Ngoài ra, khi `post.isRead === true`, khối `@if` ẩn luôn trạng thái đã đọc thay vì hiển thị huy hiệu **`✓ Đã đọc`**.
2. **Trạng thái mặc định khi vừa tạo bài mới (`AiSocialApiService.createPost`)**:
   - Trong nhánh fallback của `createPost()`, `isRead` từng bị gán cứng `true`, làm bài vừa tạo mất ngay nút đánh dấu đã đọc.

---

## 2. Changes Implemented

- [emergency-channel-view.component.html](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/views/channels/emergency-channel-view/emergency-channel-view.component.html#L166-L185):
  - Hiển thị nút `.ack-read-btn` cho mọi bài viết chưa đọc (`!post.isRead`):
    - Bài khẩn (`isUrgentBroadcast(post)`): **`✓ Xác nhận đã đọc`** (viền/nền đỏ nhạt `.urgent`).
    - Bài thông báo thường: **`✓ Đánh dấu đã đọc`**.
  - Khi đã đọc (`post.isRead`): hiển thị huy hiệu xanh **`✓ Đã đọc`** (`.ack-read-badge`) và đổi màu bộ đếm `X / Y đã đọc` sang xanh lá (`#12b76a`).
- [emergency-channel-view.component.ts](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/views/channels/emergency-channel-view/emergency-channel-view.component.ts#L47-L51):
  - Bổ sung `this.hasDistinctAction(post)` vào `isUrgentBroadcast(post)` để các bài có mục **Cần làm ngay** luôn được nhận diện là tin khẩn.
- [ai-social-api.service.ts](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/services/ai-social-api.service.ts#L182-L218):
  - Đảm bảo bài viết mới tạo khởi tạo với `isRead: Boolean(published?.isRead)` (`false`) để người dùng có thể bấm xác nhận đã đọc.
