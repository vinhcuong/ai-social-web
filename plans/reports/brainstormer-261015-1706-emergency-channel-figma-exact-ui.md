---
title: "Brainstorm & Visual Audit Report: Emergency Channel (Thông Báo Khẩn) Figma 4257:65795 Exact Alignment"
description: "Đối chiếu chi tiết Hiện trạng (Hình 1) với Thiết kế Figma 4257:65795 (Hình 2 & Hình 3) cho trang Thông báo khẩn và bộ Soạn bài Inline"
status: "ready-for-cook"
priority: "high"
effort: "2h"
branch: "main"
tags: ["ai-social-web", "figma-4257-65795", "emergency-channel", "inline-composer", "pixel-perfect"]
created: "2026-10-15T17:06:00+07:00"
---

# Báo Cáo Đối Chiếu & Chuẩn Hoá Giao Diện Kênh Thông Báo Khẩn (`Figma 4257:65795`)

## 1. Tài nguyên Figma Đã Tải Về Source (`src/assets/ai-social/emergency/`)

Đã trích xuất trực tiếp **15 file SVG/PNG gốc** từ node `4257:65795` (`fileKey: H07FLmauVKE8It4WHlsxXs`) vào [`src/assets/ai-social/emergency/`](file:///Users/vinhcuong/Dev/ai-social-web/src/assets/ai-social/emergency):

| Nhóm | File trong Source | Node Figma | Kích thước & Mô tả |
|---|---|---|---|
| **Header** | [`arrow-left-01.svg`](file:///Users/vinhcuong/Dev/ai-social-web/src/assets/ai-social/emergency/arrow-left-01.svg) | `I4257:65799;26424:9802` | `24×24px` — Icon mũi tên quay lại |
| **Composer (`Hình 3`)** | [`composer-avatar.png`](file:///Users/vinhcuong/Dev/ai-social-web/src/assets/ai-social/emergency/composer-avatar.png) | `4257:85486` | `40×40px` (`@2x 80×80`) — Avatar mạng AI tròn nền `#F0F6FF` |
| **Composer (`Hình 3`)** | [`composer-attachment-02.svg`](file:///Users/vinhcuong/Dev/ai-social-web/src/assets/ai-social/emergency/composer-attachment-02.svg) | `I4397:185129;26424:9868` | `20×20px` — Icon ghim kẹp giấy (`#0057E6`) |
| **Composer (`Hình 3`)** | [`composer-tag-01.svg`](file:///Users/vinhcuong/Dev/ai-social-web/src/assets/ai-social/emergency/composer-tag-01.svg) | `I4397:185132;26424:9868` | `20×20px` — Icon thẻ phân loại sự cố (`#0057E6`) |
| **Composer (`Hình 3`)** | [`composer-smile.svg`](file:///Users/vinhcuong/Dev/ai-social-web/src/assets/ai-social/emergency/composer-smile.svg) | `I4780:206211;26424:9868` | `20×20px` — Icon mặt cười Emoji (`#0057E6`) |
| **Composer (`Hình 3`)** | [`composer-calendar-03.svg`](file:///Users/vinhcuong/Dev/ai-social-web/src/assets/ai-social/emergency/composer-calendar-03.svg) | `I4806:223045;26424:9868` | `20×20px` — Icon lịch chọn thời hạn (`#0057E6`) |
| **Composer (`Hình 3`)** | [`composer-building-06.svg`](file:///Users/vinhcuong/Dev/ai-social-web/src/assets/ai-social/emergency/composer-building-06.svg) | `I4397:185135;26319:19678` | `20×20px` — Icon tòa nhà trong nút `"Toàn công ty"` (`#0057E6`) |
| **Composer (`Hình 3`)** | [`composer-add-circle.svg`](file:///Users/vinhcuong/Dev/ai-social-web/src/assets/ai-social/emergency/composer-add-circle.svg) | `I4397:185142;26424:9868` | `20×20px` — Icon dấu cộng tròn Bulk (`#0057E6`) |
| **Post Card (`Hình 2`)** | [`tin-khan.png`](file:///Users/vinhcuong/Dev/ai-social-web/src/assets/ai-social/emergency/tin-khan.png) | `4257:65820` | `110×110px` (`567×576`) — Thumbnail phong bì khẩn cấp đỏ/xanh |
| **Post Card (`Hình 2`)** | [`tin-thuong.png`](file:///Users/vinhcuong/Dev/ai-social-web/src/assets/ai-social/emergency/tin-thuong.png) | `4257:65855` | `110×110px` (`1015×1014`) — Thumbnail phong bì thông báo chuẩn `Hình 2` |
| **Post Card (`Hình 2`)** | [`megaphone-01.svg`](file:///Users/vinhcuong/Dev/ai-social-web/src/assets/ai-social/emergency/megaphone-01.svg) | `I4257:65825;26866:18999` | `16×16px` — Icon loa trong tag `"Đang phát"` |
| **Post Card (`Hình 2`)** | [`share-03.svg`](file:///Users/vinhcuong/Dev/ai-social-web/src/assets/ai-social/emergency/share-03.svg) | `I4257:65828;25268:13949` | `20×20px` — Icon nút `"Chia sẻ"` |
| **Post Card (`Hình 2`)** | [`link-04.svg`](file:///Users/vinhcuong/Dev/ai-social-web/src/assets/ai-social/emergency/link-04.svg) | `I4257:65829;25268:13949` | `20×20px` — Icon nút `"Copy link"` |
| **Post Card (`Hình 2`)** | [`file-pdf-24.svg`](file:///Users/vinhcuong/Dev/ai-social-web/src/assets/ai-social/emergency/file-pdf-24.svg) | `4257:65884` | `24×24px` — Icon PDF trong hộp đính kèm |
| **Post Card (`Hình 2`)** | [`download-04.svg`](file:///Users/vinhcuong/Dev/ai-social-web/src/assets/ai-social/emergency/download-04.svg) | `I4257:65893;32:7380` | `20×20px` — Icon tải xuống tệp đính kèm |

---

## 2. Phân Tích Sai Lệch Giữa Hiện Trạng (`Hình 1`) & Thiết Kế Figma (`Hình 2`, `Hình 3`)

### 2.1. Khung Soạn Bài Inline (`Hình 3` — Node `#4257:85483`)

| Thuộc tính | Hiện trạng (`Hình 1`) | Chuẩn Figma (`Hình 3` — `#4257:85483`) |
|---|---|---|
| **Khung bao (`Post`)** | Bị ẩn do lệch schema RBAC; khi hiện ở chế độ cũ là thanh thu gọn có nút `"Soạn bài"`. | Khung trắng `width: 680px`, `padding: 12px 12px 12px 20px`, `gap: 12px`, `border: 1px solid #CCD0D5`, `border-radius: 16px`. |
| **Hàng 1 (`Author` + Input)** | Chưa hiển thị trực tiếp ô nhập `"Viết thông báo"`. | Trái: `composer-avatar.png` (`40×40px`). Phải: Ô nhập không viền placeholder **`"Viết thông báo"`** (`Inter 16px Regular`, `#667183`, `line-height: 24px`). Khi click vào sẽ mở rộng mượt các trường chi tiết (`Tiêu đề`, `Nội dung / Hiện trạng`, `Cần làm ngay`). |
| **Hàng 2 — 4 Icon Action bên trái (`#4397:185128`)** | Dùng bộ icon cũ. | Cụm 4 nút Ghost `32×32px` (`padding: 6px`, `gap: 2px`, `border-radius: 8px`) dùng bộ SVG mới màu `#0057E6`:<br>1. `composer-attachment-02.svg` (Đính kèm file)<br>2. `composer-tag-01.svg` (Chọn thẻ phân loại `#`)<br>3. `composer-smile.svg` (Chèn Emoji)<br>4. `composer-calendar-03.svg` (Chọn hạn đọc / thời gian) |
| **Hàng 2 — Cụm nút bên phải (`#4397:185133` + `#4257:85497`)** | Chưa đúng bố cục Figma Desktop. | 1. Nút chọn đối tượng nhận **`Toàn công ty`** (`padding: 6px 8px`, `gap: 4px`, `border-radius: 6px`, nền `#F0F6FF`, icon `composer-building-06.svg` `20×20px` + chữ `14px Medium #0057E5`).<br>2. Vạch ngăn cách dọc `height: 24px`, `1px rgba(0,0,0,0.1)`.<br>3. Nút **`composer-add-circle.svg`** (`32×32px`, `padding: 6px`).<br>4. Nút **`Đăng bài`** (`padding: 8px 12px`, `border-radius: 8px`, `16px Medium`: khi chưa nhập nền `#E6E8EB` chữ `#8C94A1`; khi hợp lệ nền `#0057E5` chữ `#FFFFFF`). |

---

### 2.2. Thẻ Bài Viết Thông Báo Khẩn (`Hình 2` vs `Hình 1` — Node `#4257:65817` & `#4257:65852`)

| Thành phần | Lỗi hiển thị trên `Hình 1` (Hiện trạng) | Chuẩn Figma (`Hình 2` — `#4257:65817` & `#4257:65852`) |
|---|---|---|
| **1. Khung thẻ (`#4257:65852`)** | Viền `#eaeaea` mảnh, bo góc `12px`, padding `16px`. | `width: 680px`, `padding: 12px`, `gap: 12px`, `background: #FFFFFF`, `border: 1px solid #CCD0D5`, `border-radius: 16px`. |
| **2. Thumbnail bên trái (`#4257:65855`)** | Quá nhỏ (`52×52px`), khiến khối tiêu đề không cân đối như thiết kế. | Kích thước chuẩn **`110×110px`**, `border-radius: 12px`, nền `#F0F6FF`, nằm ngang hàng (`gap: 12px`) với toàn bộ khối `Tag + Tiêu đề + Thời gian đăng & Người đăng`. |
| **3. Huy hiệu Tag (`#4257:65825` & `#4257:65859`)** | - `"ĐANG PHÁT"` tô màu đỏ.<br>- `"Toàn công ty"` tô màu xanh dương. | - Tag **`Đang phát`** (`#4257:65825`): Nền `#F0F6FF`, viền `1px solid #C7DCFF`, chữ `#0057E5` (`12px Medium`), icon `megaphone-01.svg` (`16×16px`).<br>- Tag **`Toàn công ty`** (`#4257:65859`): Nền tím pastel **`#F5F2FD`**, viền **`1px solid #D1C4F2`**, chữ tím **`#5F31D3`** (`12px Medium`, `height: 24px`, `border-radius: 100px`). |
| **4. Hai nút `"Chia sẻ"` & `"Copy link"` (`#4257:65861`, `#4257:65862`)** | Chỉ hiện icon nhỏ `28×28px`, **mất chữ `"Chia sẻ"` và `"Copy link"`**. | Nút Outline có đầy đủ **Icon `20×20px` + Nhãn chữ** (`padding: 6px 8px`, `gap: 4px`, `border: 1.5px solid #E6E8EB`, `border-radius: 6px`, chữ `14px Regular #404D64`). |
| **5. Tiêu đề & Dòng thời gian (`#4257:65863`)** | Dòng chữ `Phát bởi ... • Đọc xong trước ...` tô màu đỏ gắt, lệch font. | - Tiêu đề: `Inter 16px SemiBold`, `line-height: 24px`, `#000000`.<br>- Dòng Sub (`14px Regular`, `line-height: 20px`, chấm tròn `4×4px #B3B8C1`):<br>  - Nhãn phụ (`Thời gian đăng:`, `Người đăng:`): màu `#8C94A1`.<br>  - Giá trị (`08:00`, `Nguyễn Hiền`, `Phát lúc 10:05`, `Đọc xong trước 11:00`): màu `#404D64`. |
| **6. Hộp thông tin `info-detail` (`#4257:65874`)** | - Kẻ viền bảng `1px solid #eaeaea` giữa các dòng nhìn thô như bảng biểu.<br>- Nhãn `"Cần làm ngay"` tô màu đỏ.<br>- Gặp bài có 1 trường nội dung vẫn ép hiện 3 dòng `Hiện trạng / Cần làm ngay / Người nhận`. | - Khung nền phẳng **`#F8F8F8`**, **`border-radius: 12px`**, **`padding: 12px 16px`**, **`gap: 8px`**, **không kẻ viền ngang giữa các dòng**.<br>- Cột nhãn rộng `106px`, chữ `14px Regular #667183` (`Nội dung:` hoặc `Hiện trạng:` / `Cần làm ngay:`, và `Đính kèm:`).<br>- Cột giá trị chữ `14px Regular #1A2A45`, hỗ trợ hiển thị danh sách bullet, in đậm, in nghiêng gạch chân như `Hình 2`. |
| **7. Hộp tệp đính kèm (`File Upload` `#4257:65882`)** | **Bị tràn khung ngang (Overflow)** khi tên file dài (`35503e4823b1f1cc9...`), thiếu bố cục 2 dòng Tên file + Dung lượng. | Hộp full-width bên trong cột phải (`padding: 8px`, `gap: 8px`, `background: rgba(0, 0, 0, 0.05)`, `border: 1px solid #E6E8EB`, `border-radius: 8px`, `min-width: 0`):<br>- Trái: `file-pdf-24.svg` (`24×24px`).<br>- Giữa (`flex: 1; min-width: 0`): Dòng 1 là tên file (`14px Medium #000A1A`, `text-overflow: ellipsis; overflow: hidden; white-space: nowrap` — **chống tràn 100%**); Dòng 2 là dung lượng (`410 KB`, `12px Regular #404D64`).<br>- Phải: Nút tải xuống `32×32px` (`download-04.svg` `20×20px`). |
| **8. Chân thẻ (`Note` `#4257:84986`)** | Đặt bên trái, có đường kẻ `border-top` thừa. | **Căn sát góc phải (`justify-content: flex-end`, `gap: 8px`, không có `border-top`)**:<br>`238 / 260 đã đọc` (`14px Regular #404D64`) + chấm tròn `8×8px #B3B8C1` + `Danh sách chi tiết` (`14px Medium #0062E1`). |

---

### 2.3. Header Trang Thông Báo Khẩn (`#4257:65797`)
- Thay khung hộp viền hồng cũ bằng thanh Header chuẩn Figma `#4257:65797` (`padding-bottom: 12px`, `border-bottom: 1px solid #E1E9F4`):
  - Trái: Nút tròn `arrow-left-01.svg` (`40×40px`) + Tiêu đề `"Thông báo khẩn"` (`18px SemiBold #000A1A`) + Phụ đề `"Sự cố, an ninh mạng, chỉ đạo gấp"` (`12px Medium #667183`).
  - Phải: Huy hiệu thương hiệu viền gradient xanh (`logo.png` `16×16px` + `"VNPT AI Social"`).

---

## 3. Kế Hoạch Thực Thi Khi Chạy `/cook`

1. **Bỏ Sidebar trái trên `AiSocialShellComponent`** (theo quyết định đã chốt của bạn ở bước trước) và sửa dứt điểm RBAC `AiSocialAuthService` để tài khoản thực luôn hiển thị khung soạn bài.
2. **Dựng lại `InlineComposerCardComponent` chuẩn 100% `Hình 3` (`#4257:85483`)**:
   - Sử dụng toàn bộ bộ SVG mới (`composer-avatar.png`, `composer-attachment-02.svg`, `composer-tag-01.svg`, `composer-smile.svg`, `composer-calendar-03.svg`, `composer-building-06.svg`, `composer-add-circle.svg`).
   - Hỗ trợ đầy đủ thao tác chọn tệp đính kèm, gắn tag phân loại sự cố, chèn emoji, chọn hạn đọc, chọn đơn vị nhận (`Toàn công ty`) và đăng bài.
3. **Dựng lại `EmergencyChannelViewComponent` chuẩn 100% `Hình 2` (`#4257:65817` & `#4257:65852`)**:
   - Header thanh ngang chuẩn `#4257:65797`.
   - Thẻ bài viết `680px` bo góc `16px`, viền `#CCD0D5`, thumbnail `110×110px` (`tin-khan.png` / `tin-thuong.png`), tag `"Toàn công ty"` tím pastel `#F5F2FD`/`#5F31D3`, tag `"Đang phát"` xanh `#F0F6FF`/`#0057E5`, 2 nút Outline có chữ `"Chia sẻ"` & `"Copy link"`, hộp `#F8F8F8` không viền kẻ bảng, hộp file đính kèm 2 dòng chống tràn 100%, và footer thống kê căn phải chuẩn Figma.
