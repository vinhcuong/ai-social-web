---
title: "Cook Implementation Report: Sidebar Removal, RBAC Sync & Emergency Channel Figma 4257:65795"
description: "Báo cáo hoàn thành loại bỏ Sidebar trái, sửa quyền RBAC đăng bài thực tế và chuẩn hoá giao diện Thông báo khẩn + Bộ soạn bài Inline theo Figma 4257:65795"
status: "completed"
priority: "high"
effort: "2h"
branch: "main"
tags: ["ai-social-web", "cook-report", "figma-4257-65795", "emergency-channel", "inline-composer", "rbac"]
created: "2026-10-15T17:21:00+07:00"
---

# Báo Cáo Thực Thi (`/cook`): Bỏ Sidebar Trái, Sửa Quyền RBAC & Đồng Bộ Thông Báo Khẩn (`Figma 4257:65795`)

## 1. Hạng mục đã hoàn thành

### Phase 01 — Bỏ Sidebar Trái & Đồng Bộ Quyền RBAC Với Mobile
- **Loại bỏ hoàn toàn `<aside class="shell-sidebar">`** trong [`ai-social-shell.component.html`](file:///Users/vinhcuong/Dev/ai-social-web/src/app/shell/ai-social-shell.component.html) và [`ai-social-shell.component.scss`](file:///Users/vinhcuong/Dev/ai-social-web/src/app/shell/ai-social-shell.component.scss).
- **Chuyển lên thanh Top Header (`height: 60px`)**:
  - Bên trái: Logo [`logo.png`](file:///Users/vinhcuong/Dev/ai-social-web/src/assets/ai-social/logo.png) (`36×36px`) + **`VNPT AI Social`** (bấm về thẳng `/home`).
  - Bên phải: Chuông thông báo + Thông tin người dùng (`Avatar` + `Họ tên` + `Đơn vị`) + Nút Đăng xuất.
- **Sửa lỗi Mapping Quyền RBAC trong [`auth.models.ts`](file:///Users/vinhcuong/Dev/ai-social-web/src/app/core/models/auth.models.ts) và [`ai-social-auth.service.ts`](file:///Users/vinhcuong/Dev/ai-social-web/src/app/core/services/ai-social-auth.service.ts)**:
  - Hỗ trợ đầy đủ `publisherChannels: string[]`, `roles: string[]`, `khanTypes: string[]`, `sotayTypes: string[]` khớp 100% với [`permissions_model.dart`](file:///Users/vinhcuong/Dev/mobile-GCN-2/mobileapp/STM/packages/gcn_ai_social/lib/src/data/models/permissions_model.dart) trên Mobile để tài khoản thực luôn nhận đúng quyền đăng bài.

### Phase 02 — Khung Soạn Bài Inline Chuẩn `Hình 3` (`Figma 4257:85483`)
- Cập nhật [`inline-composer-card.component.ts`](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/components/composer/inline-composer-card/inline-composer-card.component.ts), [`inline-composer-card.component.html`](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/components/composer/inline-composer-card/inline-composer-card.component.html), [`inline-composer-card.component.scss`](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/components/composer/inline-composer-card/inline-composer-card.component.scss):
  - Khung trắng `max-width: 680px`, `padding: 12px 12px 12px 20px`, `border: 1px solid #CCD0D5`, `border-radius: 16px`.
  - Hàng 1: Avatar AI [`composer-avatar.png`](file:///Users/vinhcuong/Dev/ai-social-web/src/assets/ai-social/emergency/composer-avatar.png) (`40×40px`) + Ô input không viền placeholder `"Viết thông báo"` (click vào mở rộng mượt các trường `NỘI DUNG / HIỆN TRẠNG *`, `CẦN LÀM NGAY`, dải 4 chip `# Hashtag` phân loại sự cố, hạn đọc).
  - Hàng 2 (Action Toolbar luôn hiển thị):
    - Trái: 4 nút icon SVG mới (`20×20px`, `#0057E6`): [`composer-attachment-02.svg`](file:///Users/vinhcuong/Dev/ai-social-web/src/assets/ai-social/emergency/composer-attachment-02.svg), [`composer-tag-01.svg`](file:///Users/vinhcuong/Dev/ai-social-web/src/assets/ai-social/emergency/composer-tag-01.svg), [`composer-smile.svg`](file:///Users/vinhcuong/Dev/ai-social-web/src/assets/ai-social/emergency/composer-smile.svg), [`composer-calendar-03.svg`](file:///Users/vinhcuong/Dev/ai-social-web/src/assets/ai-social/emergency/composer-calendar-03.svg).
    - Phải: Nút **`Toàn công ty`** (`#F0F6FF` / `#0057E5` kèm [`composer-building-06.svg`](file:///Users/vinhcuong/Dev/ai-social-web/src/assets/ai-social/emergency/composer-building-06.svg)) + vạch ngăn cách dọc + nút [`composer-add-circle.svg`](file:///Users/vinhcuong/Dev/ai-social-web/src/assets/ai-social/emergency/composer-add-circle.svg) + nút **`Đăng bài`** (`#E6E8EB` disabled / `#0057E5` active).

### Phase 03 — Trang & Thẻ Thông Báo Khẩn Chuẩn `Hình 2` (`Figma 4257:65795`)
- Cập nhật [`emergency-channel-view.component.ts`](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/views/channels/emergency-channel-view/emergency-channel-view.component.ts), [`emergency-channel-view.component.html`](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/views/channels/emergency-channel-view/emergency-channel-view.component.html), [`emergency-channel-view.component.scss`](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/views/channels/emergency-channel-view/emergency-channel-view.component.scss):
  - **Header kênh (`#4257:65797`)**: Thanh ngang đầu trang với nút tròn [`arrow-left-01.svg`](file:///Users/vinhcuong/Dev/ai-social-web/src/assets/ai-social/emergency/arrow-left-01.svg) (`40×40px`) + `"Thông báo khẩn"` (`18px SemiBold`) + `"Sự cố, an ninh mạng, chỉ đạo gấp"` (`12px Medium #667183`) + Huy hiệu thương hiệu bên phải.
  - **Thumbnail `110×110px`**: Hiển thị [`tin-khan.png`](file:///Users/vinhcuong/Dev/ai-social-web/src/assets/ai-social/emergency/tin-khan.png) và [`tin-thuong.png`](file:///Users/vinhcuong/Dev/ai-social-web/src/assets/ai-social/emergency/tin-thuong.png) độ phân giải cao vừa tải từ Figma.
  - **Hàng Tag & 2 Nút Outline có chữ**: Tag `Toàn công ty` tím pastel (`#F5F2FD` / `#D1C4F2` / `#5F31D3`), tag `Đang phát` xanh (`#F0F6FF` / `#C7DCFF` / `#0057E5` + `megaphone-01.svg`), và 2 nút Outline có đầy đủ Icon + chữ **`Chia sẻ`** & **`Copy link`**.
  - **Hộp `info-detail` (`#F8F8F8`) & Hộp File Đính Kèm Chống Tràn (`#4257:65882`)**:
    - Bỏ toàn bộ đường kẻ viền bảng thô; hiển thị nhãn `Nội dung:` / `Hiện trạng:` / `Cần làm ngay:` / `Đính kèm:` rộng `106px` (`#667183`).
    - Hộp file đính kèm `rgba(0,0,0,0.05)` viền `#E6E8EB`, icon [`file-pdf-24.svg`](file:///Users/vinhcuong/Dev/ai-social-web/src/assets/ai-social/emergency/file-pdf-24.svg) (`24×24px`), tên file cắt `ellipsis` chống tràn 100%, dung lượng ở dòng 2, và nút tải [`download-04.svg`](file:///Users/vinhcuong/Dev/ai-social-web/src/assets/ai-social/emergency/download-04.svg) ở góc phải.
  - **Footer (`Note` `#4257:84986`)**: Căn phải chuẩn Figma (`238 / 260 đã đọc` • chấm tròn `8×8px #B3B8C1` • `Danh sách chi tiết` `#0062E1`).

## 2. Kiểm chứng Build & Quy chuẩn File Size
- **Angular Build (`npx ng build --configuration development`)**: Thành công `0 errors` (`2.307s`).
- **Giới hạn `<= 200` dòng/file**: Toàn bộ file trong `src/app/` đạt chuẩn `<= 200` dòng (file lớn nhất `200` dòng).
