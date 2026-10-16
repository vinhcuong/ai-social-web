# Cook Implementation Plan: Media & File Load Error Handling (Graceful Placeholder)

**Slug**: `media-load-error-placeholder`  
**Date**: 2026-10-16  
**Reference Report**: [brainstormer-261016-0925-media-load-error-placeholder.md](./brainstormer-261016-0925-media-load-error-placeholder.md)  
**Status**: In Progress  

---

## 1. Mục tiêu & Phạm vi (Scope)
- Thay thế hoàn toàn vùng hiển thị ảnh/video bị lỗi (khối đen `#0f172a` hoặc khối đỏ thô ráp kèm icon gãy vỡ) bằng một Placeholder chuẩn UX:
  - Khung xám nhạt trung tính `#f8fafc` viền dashed thanh lịch.
  - Icon phân loại lỗi (Image / Video).
  - Tên tệp đính kèm và nhãn trạng thái ("Không thể tải hình ảnh" / "Không thể phát video").
  - Nút thao tác nhanh "↻ Thử lại" (cache-buster reload) và "↗ Mở link gốc".
- Tích hợp Skeleton Shimmer khi media đang ở trạng thái `loading`.
- Xóa bỏ triệt để hardcoded `background: #0f172a;` gây khối đen kịt trong CSS `.media-tile`.
- Bổ sung fallback kiểm tra URL tệp đính kèm (`.figma-file-box` / `.doc-chip`) khi bấm tải hoặc xem.

---

## 2. Danh sách Files cần Tạo & Sửa Đổi
1. **Tạo mới**:
   - `src/app/features/ai-social/components/media-tile/media-tile.component.ts` (< 100 lines)
   - `src/app/features/ai-social/components/media-tile/media-tile.component.html` (< 80 lines)
   - `src/app/features/ai-social/components/media-tile/media-tile.component.scss` (< 120 lines)
2. **Cập nhật**:
   - `src/app/features/ai-social/views/channels/emergency-channel-view/emergency-channel-view.component.html`
   - `src/app/features/ai-social/views/channels/emergency-channel-view/emergency-channel-view.component.ts`
   - `src/app/features/ai-social/views/channels/emergency-channel-view/emergency-channel-view.component.scss`
   - `src/app/features/ai-social/views/channels/event-channel-view/event-channel-view.component.html`
   - `src/app/features/ai-social/views/channels/event-channel-view/event-channel-view.component.ts`
   - `src/app/features/ai-social/views/channels/event-channel-view/event-channel-view.component.scss`
   - `src/app/features/ai-social/components/post-card/post-card.component.html`
   - `src/app/features/ai-social/components/post-card/post-card.component.ts`
   - `src/app/features/ai-social/components/post-card/post-card.component.scss`
   - `src/app/features/ai-social/components/media-lightbox-modal/media-lightbox-modal.component.ts`

---

## 3. Checklist Thực thi (Execution Steps)
- [x] **Bước 1**: Tạo `MediaTileComponent` với đầy đủ trạng thái `loading`, `loaded`, `error`, và logic retry.
- [x] **Bước 2**: Tích hợp `MediaTileComponent` vào `emergency-channel-view` và thay đổi CSS nền `#0f172a` $\rightarrow$ `#f1f5f9`.
- [x] **Bước 3**: Tích hợp `MediaTileComponent` vào `event-channel-view` và cập nhật CSS nền.
- [x] **Bước 4**: Tích hợp `MediaTileComponent` vào `post-card` (kênh truyền thông / feed chung).
- [x] **Bước 5**: Thêm cơ chế fallback trong `media-lightbox-modal` và kiểm tra an toàn URL file đính kèm.
- [x] **Bước 6**: Build kiểm thử `npx ng build` và xác nhận không có lỗi biên dịch.

---

## 4. Kết quả Nghiệm thu
- **Không còn khối đen/đỏ**: Tất cả các `.media-tile` đã loại bỏ background `#0f172a`, chuyển sang nền xám nhạt `#f1f5f9`.
- **Placeholder chuẩn UX**: Khi link ảnh hoặc video bị lỗi hoặc hết hạn, hiển thị khung placeholder xám `#f8fafc` có viền nét đứt thanh lịch, icon loại tệp, nhãn lỗi rõ ràng, kèm nút **"Thử lại"** và **"Mở link gốc"**.
- **An toàn tệp đính kèm**: Khi click vào file tài liệu PDF/Doc có URL rỗng hoặc hỏng, hệ thống hiển thị cảnh báo thay vì mở tab trắng.
- **Biên dịch**: `ng build` thành công 100% không cảnh báo cú pháp.
