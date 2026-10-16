# Cook Report: Tách Hashtag Phân Loại Xuống Trên Footer & Khôi Phục Cụm Trạng Thái Ở Đỉnh Thẻ

- **Thời gian**: 2026-10-16 11:04
- **Trạng thái**: Hoàn thành (Success)
- **Mục tiêu**: Đưa cụm `emerg-tags-actions-row` (gồm `Đang phát` / `Đã kết thúc`, `Toàn công ty`, nút `Chia sẻ` và `Copy link`) trở lại phần đầu thẻ cạnh thumbnail 110x110 (khớp 100% Hình 1 Design), và chỉ đưa duy nhất phần hashtag chuyên mục (`# Category`) xuống phía dưới thân bài, ngay trên footer `Xác nhận đã đọc`.

---

## 1. Các hạng mục đã thực thi

1. **Cập nhật Template ([emergency-channel-view.component.html](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/views/channels/emergency-channel-view/emergency-channel-view.component.html))**:
   - Khôi phục `<div class="emerg-tags-actions-row">` bên trong `emerg-head-content` (ngay trên `emerg-title-sub-group`):
     - Bên trái: Badge trạng thái (`Đang phát` / `Đã kết thúc`) + Badge đối tượng (`Toàn công ty` / Đơn vị).
     - Bên phải: Nút `Chia sẻ` + Nút `Copy link`.
   - Bổ sung `<div class="emerg-hashtags-row">` ở cuối thân bài, ngay trước `<footer class="emerg-note-footer">`:
     - Chứa duy nhất `<span class="tag-pill category"># {{ getCategoryLabel(post.categoryCode) }}</span>`.
   - Loại bỏ khối actions cũ bị dồn xuống đáy ở turn trước.
   - Số dòng template: **191 dòng** (tuân thủ giới hạn <200 LOC).

2. **Cập nhật Styling ([emergency-channel-view.component.scss](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/views/channels/emergency-channel-view/emergency-channel-view.component.scss))**:
   - Áp dụng style `.tag-pill` cho cả `.emerg-tags-actions-row` và `.emerg-hashtags-row`.
   - Bổ sung định dạng `.emerg-hashtags-row { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; margin-top: -2px; }`.
   - Số dòng SCSS: **197 dòng** (tuân thủ giới hạn <200 LOC).

---

## 2. Kết quả kiểm thử build

- **Lệnh**: `npm run build vnpt-ai-social-web --configuration production`
- **Kết quả**: Exit code `0` (Success, 0 errors, 0 warnings).
