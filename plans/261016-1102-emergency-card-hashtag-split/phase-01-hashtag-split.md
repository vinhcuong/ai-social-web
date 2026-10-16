# Phase 01: Tách Cấu Trúc HTML & Styling Thẻ Thông Báo Khẩn

## Context Links
- [Báo cáo Brainstorm](file:///Users/vinhcuong/Dev/ai-social-web/plans/reports/brainstormer-261016-1040-emergency-card-hashtag-split-refinement.md)
- [emergency-channel-view.component.html](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/views/channels/emergency-channel-view/emergency-channel-view.component.html)
- [emergency-channel-view.component.scss](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/views/channels/emergency-channel-view/emergency-channel-view.component.scss)

---

## Overview
- **Mục tiêu**: Tách biệt rõ ràng cụm trạng thái + đối tượng + tác vụ (ở đầu thẻ) và cụm hashtag phân loại chuyên mục (ở cuối thân bài, ngay trên footer).
- **Trạng thái**: Sẵn sàng thực hiện.
- **Ưu tiên**: High.

---

## Key Insights
- Ở turn trước, toàn bộ hàng `emerg-tags-actions-row` đã bị đưa xuống dưới, khiến cụm nút `Chia sẻ` / `Copy link` và badge `Toàn công ty` biến mất khỏi đỉnh thẻ cạnh thumbnail 110x110.
- Yêu cầu thực tế của người dùng: **Chỉ đưa mỗi hashtag xuống dưới**, các phần còn lại (`Đang phát`, `Toàn công ty`, `Chia sẻ`, `Copy link`) vẫn ở trên cùng cạnh thumbnail.

---

## Chi tiết Thay đổi Kỹ thuật

### 1. Template ([emergency-channel-view.component.html](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/views/channels/emergency-channel-view/emergency-channel-view.component.html))
1. **Tại `emerg-head-content` (cạnh thumbnail 110x110)**:
   - Thêm `<div class="emerg-tags-actions-row">`:
     - Trái: Tag trạng thái phát (`Đang phát` / `Đã kết thúc`) + Tag đối tượng nhận (`Toàn công ty` / Đơn vị).
     - Phải: Nút `Chia sẻ` + Nút `Copy link`.
   - Giữ nguyên `emerg-title-sub-group` ngay phía dưới hàng actions này.
2. **Tại vị trí trước `<footer class="emerg-note-footer">`**:
   - Thêm `<div class="emerg-hashtags-row">`:
     - Chứa duy nhất: `<span class="tag-pill category"># {{ getCategoryLabel(post.categoryCode) }}</span>`.

### 2. Styling ([emergency-channel-view.component.scss](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/views/channels/emergency-channel-view/emergency-channel-view.component.scss))
- Thêm định dạng cho `.emerg-hashtags-row`:
  ```scss
  .emerg-hashtags-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
  }
  ```

---

## Todo List
- [x] Cập nhật `emergency-channel-view.component.html` theo cấu trúc tách hashtag.
- [x] Cập nhật `emergency-channel-view.component.scss` bổ sung class `.emerg-hashtags-row`.
- [x] Kiểm tra số dòng của cả 2 file đảm bảo < 200 dòng.
- [x] Chạy `npm run build` để kiểm tra không phát sinh lỗi biên dịch.

---

## Success Criteria
1. Đỉnh thẻ bài viết khẩn hiển thị đầy đủ: `Đang phát`, `Toàn công ty`, `Chia sẻ`, `Copy link` ngang hàng.
2. Ngay trên footer `Xác nhận đã đọc` hiển thị riêng hashtag `# [Chuyên mục]`.
3. `npm run build` thành công 100% với 0 warning, 0 error.
