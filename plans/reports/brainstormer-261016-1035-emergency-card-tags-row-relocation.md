---
title: "Brainstorm: Tái bố cục chuyển hàng Tags/Hashtags xuống phía trên Footer Xác nhận đã đọc"
description: "Phân tích và lựa chọn phương án dời khối emerg-tags-actions-row (Đang phát, # Category, Toàn công ty, Chia sẻ, Copy link) từ đầu bài viết xuống ngay phía trên footer Xác nhận đã đọc & Danh sách chi tiết."
status: decided
topic: "emergency-card-tags-row-relocation"
chosen_option: "Option 1: Chuyển toàn bộ emerg-tags-actions-row xuống ngay phía trên emerg-note-footer"
date: 2026-10-16
tags: [emergency-channel, post-card, ui-layout, layout-refactor, tags-placement]
---

# Brainstorm Report: Tái bố cục chuyển hàng Tags/Hashtags trên Thẻ Thông Báo Khẩn

## Executive Summary
Người dùng yêu cầu dời khối `<div class="emerg-tags-actions-row">` (chứa các nhãn `Đang phát`, `# Phân loại`, `Toàn công ty` và 2 nút `Chia sẻ`, `Copy link`) từ vị trí trên cùng của thẻ bài viết xuống phía dưới, đặt ngay phía trên khối xác nhận đã đọc (`✓ Xác nhận đã đọc`) và danh sách chi tiết (`Danh sách chi tiết`). Sau khi đánh giá luồng thị giác và trải nghiệm đọc, việc đưa hàng tags và nút chia sẻ xuống dưới giúp tiêu đề bài viết nổi bật ngay lập tức cạnh ảnh đại diện thumbnail, đồng thời gom các thông tin phân loại & hành động tương tác vào đúng ngữ cảnh sau khi người dùng đã đọc xong nội dung bài viết.

---

## Context & Objectives
- **Vấn đề hiện tại**: Khối `emerg-tags-actions-row` đang nằm ở dòng đầu tiên của `emerg-head-content` (ngang hàng trên cùng cạnh ảnh 110x110). Khi bài viết có nhiều nhãn và tiêu đề dài, phần đầu thẻ bị phân tán thị giác giữa các badge màu sắc, nút chia sẻ và tiêu đề chính.
- **Yêu cầu của người dùng**: Đưa nguyên khối `emerg-tags-actions-row` xuống dưới, đặt ngay phía trên phần xác nhận đã đọc (`.ack-read-btn`) và danh sách chi tiết (`.detail-list-link`).
- **Mục tiêu**:
  1. Tái cấu trúc luồng đọc tự nhiên: **Tiêu đề & Tác giả/Thời gian -> Nội dung Hiện trạng/Cần làm -> Đính kèm & Media -> Tags & Chia sẻ -> Xác nhận đọc & Thống kê**.
  2. Đảm bảo giao diện cân đối, không bị lệch layout trên cả Desktop (680px) và Mobile (< 560px).
  3. Tuân thủ nghiêm ngặt quy tắc file size < 200 dòng (`GEMINI.md`).

---

## So sánh Cấu trúc Giao diện Trước & Sau

### 1. Cấu trúc Hiện tại (Before)
```
┌────────────────────────────────────────────────────────┐
│ [110x110]  [Đang phát] [# An ninh] [Toàn cty] [Chia sẻ][Link] │ (tags ở đỉnh)
│ Thumbnail  TIÊU ĐỀ BÀI VIẾT KHẨN                       │
│            Phát lúc 09:16 • Người đăng: Đồng Anh Cường │
├────────────────────────────────────────────────────────┤
│ [Nội dung / Hiện trạng / Cần làm ngay / File đính kèm] │
├────────────────────────────────────────────────────────┤
│ [Lưới ảnh / Media đính kèm]                            │
├────────────────────────────────────────────────────────┤
│ [✓ Xác nhận đã đọc]           24/260 đã đọc • Chi tiết │
└────────────────────────────────────────────────────────┘
```

### 2. Cấu trúc Đề xuất (After - User Expected)
```
┌────────────────────────────────────────────────────────┐
│ [110x110]  TIÊU ĐỀ BÀI VIẾT KHẨN                       │ (Tiêu đề lên đầu)
│ Thumbnail  Phát lúc 09:16 • Người đăng: Đồng Anh Cường │
├────────────────────────────────────────────────────────┤
│ [Nội dung / Hiện trạng / Cần làm ngay / File đính kèm] │
├────────────────────────────────────────────────────────┤
│ [Lưới ảnh / Media đính kèm]                            │
├────────────────────────────────────────────────────────┤
│ [Đang phát] [# An ninh] [Toàn cty]     [Chia sẻ][Link] │ (Tags & Actions ở đây)
├────────────────────────────────────────────────────────┤
│ [✓ Xác nhận đã đọc]           24/260 đã đọc • Chi tiết │ (Footer xác nhận)
└────────────────────────────────────────────────────────┘
```

---

## Đánh giá các Phương án Kỹ thuật (Evaluated Options)

### Option 1: Chuyển toàn bộ `emerg-tags-actions-row` xuống ngay trên `emerg-note-footer` (Khuyến nghị)
- **Mô tả**:
  - Cắt toàn bộ khối `<div class="emerg-tags-actions-row">` khỏi `emerg-head-content`.
  - Đặt khối này ngay phía dưới `emerg-info-detail-box` (và `emerg-media-grid` nếu có), ngay trước `<footer class="emerg-note-footer">`.
  - Điều chỉnh CSS: Thêm đường phân cách mỏng hoặc margin phù hợp để tạo nhịp phân cách êm ái giữa nội dung bài viết và hàng tags.
- **Ưu điểm**:
  - Khớp 100% mã HTML người dùng đã chỉ định.
  - Tiêu đề thông báo khẩn ở đầu bài trở nên to rõ, trang trọng, người đọc nắm bắt tin tức ngay từ cái nhìn đầu tiên.
  - Sau khi đọc xong nội dung và xem hình ảnh, người dùng thấy các hashtag phân loại và có thể bấm `Chia sẻ` hoặc `Copy link` ngay.
  - Triển khai cực kỳ an toàn, không làm tăng dòng code, duy trì file < 190 dòng.
- **Nhược điểm & Rủi ro**: Cần kiểm tra khoảng cách chiều cao của cột thumbnail 110x110 với cụm tiêu đề bên phải để đảm bảo không bị khoảng trống thừa khi tiêu đề ngắn.
  - *Giải pháp*: Cột `emerg-top-row` đã có `display: flex; align-items: flex-start; gap: 12px;`, thumbnail tự động căn đầu dòng mượt mà.

---

### Option 2: Tách riêng nút Chia sẻ/Copy link ở trên, chỉ chuyển Tags xuống dưới
- **Mô tả**: Giữ 2 nút Chia sẻ / Copy link ở góc phải trên cùng của tiêu đề, chỉ đưa các tag `# An toàn thông tin`, `Đang phát` xuống dưới.
- **Ưu điểm**: Giữ nút chia sẻ nhanh ở đỉnh bài viết.
- **Nhược điểm**:
  - Không đúng với snippet người dùng đã copy và dán yêu cầu (`emerg-tags-actions-row` nguyên khối).
  - Phải tách class CSS và tạo thêm layout wrapper mới, làm tăng số dòng code vượt ngưỡng 200 dòng.

---

## Ma trận Đánh giá (Trade-off Matrix)

| Tiêu chí | Option 1 (Chuyển cả hàng - Khuyến nghị) | Option 2 (Tách rời tags và buttons) |
|---|---|---|
| Khớp đúng yêu cầu người dùng | **5/5 (100% khớp snippet)** | 3/5 (Sai khác mong đợi) |
| Tính mạch lạc luồng đọc (UX) | **5/5 (Tiêu đề nổi bật -> Đọc -> Tương tác)** | 4/5 |
| Độ an toàn & File size (< 200 dòng) | **5/5 (Chỉ đảo vị trí, giữ nguyên < 190 dòng)** | 3/5 (Tăng dòng code) |
| Độ phức tạp triển khai | **Rất thấp (~15 phút)** | Trung bình |

---

## Quyết định Kỹ thuật (Final Decision)
- **Chọn Option 1**: Di chuyển toàn bộ khối `<div class="emerg-tags-actions-row">` xuống nằm giữa `emerg-info-detail-box`/`emerg-media-grid` và `<footer class="emerg-note-footer">`.
- Tinh chỉnh CSS nếu cần: Đảm bảo khoảng cách `gap` giữa hàng tags và footer xác nhận đã đọc là 10px - 12px, có tính responsive flex-wrap mượt mà trên mobile.

---

## Các Bước Tiếp Theo (Next Steps)
1. Xác nhận phương án với người dùng qua lệnh `/planning` hoặc `/cook`.
2. Cập nhật template `emergency-channel-view.component.html`.
3. Kiểm tra hiển thị trên trình duyệt và chạy `npm run build` xác thực 0 lỗi.
