---
title: "Brainstorm & Audit Report: Left Sidebar UX/UI & Emergency Inline Composer Synchronization"
description: "Đánh giá kiến trúc thanh điều hướng Sidebar trái và phân tích nguyên nhân/giải pháp đồng bộ tính năng Đăng bài Thông báo khẩn từ Mobile lên Web"
status: "ready-for-decision"
priority: "high"
effort: "2h"
branch: "main"
tags: ["ai-social-web", "sidebar-ux", "emergency-composer", "rbac", "mobile-sync"]
created: "2026-10-15T16:58:00+07:00"
---

# Báo Cáo Đánh Giá & Giải Pháp: Sidebar Điều Hướng Trái & Bộ Soạn Thảo Thông Báo Khẩn

---

## VẤN ĐỀ 1: Có nên dựng khung Menu Sidebar bên trái (`Hình 1`) không? Nếu dựng thì tối ưu giao diện & đồng bộ màu như thế nào?

### 1.1. Đánh giá thẳng thắn hiện trạng `Hình 1` (Brutal Honesty Audit)

Quan sát trực tiếp ảnh chụp màn hình `Hình 1` (`AiSocialShellComponent`), thanh Sidebar bên trái hiện tại đang gặp **5 điểm nghẽn thẩm mỹ và trải nghiệm**:

1. **Lặp thông tin (Redundancy) khi đứng ở Trang chủ (`/home`)**:
   - Trên màn `/home`, người dùng đã có **4 thẻ kênh 3D kích thước lớn (`288×190px`)** hiển thị đầy đủ tên kênh, mô tả và badge số lượng. Việc cột trái tiếp tục liệt kê lại đúng 4 kênh đó kèm dòng mô tả phụ bị cắt cụt (`"Tin chỉ đạo khẩn cấp & xác nhậ..."`, `"Lịch trình, đăng ký tham dự & k..."`) gây rối mắt và thừa thông tin.
2. **Ngôn ngữ thị giác lệch tông với Figma (`3987:126348`)**:
   - Thanh vạch dọc `4px` (`channel-indicator`) kết hợp viền đỏ đậm bao quanh mục đang chọn và huy hiệu tròn đặc (`#2`, `#3`, `#1` màu xanh/đỏ gắt) nhìn thô, không đồng bộ với hệ màu Pastel & `Tag / Colorful` của Figma (`#FEEBEC`, `#FFF9EB`, `#F5F2FD`, `#F0F6FF`).
3. **Thẻ `"Hoàn thành đọc bắt buộc 0% (Đã xác nhận 0/0 bài viết)"` vô nghĩa khi `total = 0`**:
   - Khi API `/api/v1/me/progress` trả về `0/0`, việc hiển thị khối `0%` chiếm diện tích đáy sidebar tạo cảm giác lỗi dữ liệu.
4. **Lỗi hiển thị ảnh Logo ở phiên bản cũ**:
   - Đường dẫn cũ `assets/images/icons/auth/logo.svg` bị gãy (`broken image` `VNPT`), cần cố định bằng `assets/ai-social/logo.png` kèm bo góc `36×36px`.

---

### 1.2. Phân tích 3 Phương án Kiến trúc Điều hướng (Trade-off Matrix)

| Tiêu chí | Phương án A: Bỏ hẳn Sidebar trái (Giống Mobile 100%) | Phương án B (Khuyên dùng): Sidebar thông minh đồng bộ Figma (Ẩn trên `/home`, Hiện khi vào `/channels/:code` hoặc Collapsible) | Phương án C: Luôn hiện Sidebar trái cố định nhưng thiết kế lại chuẩn Figma Pastel |
|---|---|---|---|
| **Trải nghiệm tại `/home`** | Rộng rãi, đúng 100% bố cục Figma `4818:54017` | Rộng rãi, không bị lặp 4 kênh với 4 thẻ lớn trên `/home` | Vẫn bị lặp 4 kênh ở cả cột trái và lưới thẻ giữa màn hình |
| **Chuyển kênh nhanh khi đang ở `/channels/khan` sang `sukien`, `truyenthong`, `sotay`** | Phải bấm `← Quay lại` về `/home` rồi mới bấm sang kênh khác (2 bước) | **1 click** chuyển thẳng giữa 4 kênh ngay bên trái mà không cần quay về `/home` | **1 click** chuyển thẳng giữa 4 kênh |
| **Độ đồng bộ màu sắc & thẩm mỹ** | Cao | **Rất cao** (dùng icon 3D thu nhỏ `32×32px` + pill màu Pastel của Figma) | Cao sau khi thiết kế lại |

### 1.3. Đề xuất Thiết kế lại Sidebar chuẩn Figma Pastel (Áp dụng cho Phương án B / C)

Nếu giữ Sidebar (hoặc bật Sidebar khi vào trong các kênh `/channels/:code` kèm nút thu gọn), giao diện cần được chuẩn hóa theo đúng bảng màu của 4 thẻ Figma:

```
┌──────────────────────────────────────────────────────────┐
│ [Logo 36x36]  VNPT AI Social                             │
│               Truyền thông & Văn hoá số                  │
├──────────────────────────────────────────────────────────┤
│  🏠  Trang chủ AI Social                        [Active] │
│                                                          │
│  KÊNH TRUYỀN THÔNG                                       │
│  🔔  Thông báo khẩn                         [• 2 chưa đọc]│ -> Active bg: #FEF4F4, border: #FCBBBE, tag: #FEEBEC/#F52833
│  📅  Thông tin sự kiện                        [• 3 tin mới]│ -> Active bg: #FFF9EB, border: #FFE2A3, tag: #FFF9EB/#DB8F00
│  📣  Truyền thông nội bộ                                 │ -> Active bg: #F5F2FD, border: #D1C4F2, tag: #F5F2FD/#5F31D3
│  📘  Sổ tay văn hoá                           [1 bắt buộc]│ -> Active bg: #F0F6FF, border: #C7DCFF, tag: #F0F6FF/#0057E5
├──────────────────────────────────────────────────────────┤
│  (Chỉ hiện thẻ Tiến độ đọc khi totalMandatory > 0)       │
├──────────────────────────────────────────────────────────┤
│ [Avatar]  Đồng Anh Vĩnh Cường                      [⎋]   │
│           Trung tâm SP & TNXS                            │
└──────────────────────────────────────────────────────────┘
```

- **5 thay đổi cốt lõi để Sidebar đẹp và đồng bộ**:
  1. **Bỏ dòng phụ đề dài bị cắt `...`** dưới mỗi kênh và **bỏ vạch màu dọc `4px`**; thay bằng **Icon 3D thu nhỏ (`32×32px` bo góc `8px`)** lấy trực tiếp từ bộ asset Figma (`thong-bao-khan.png`, `thong-tin-su-kien.png`, `truyen-thong-noi-bo.png`, `so-tay-van-hoa.png`).
  2. **Đồng bộ màu Active & Hover theo từng kênh**:
     - `Trang chủ` / `Sổ tay`: Nền `#F0F6FF`, viền `#C7DCFF`, chữ `#0057E5`.
     - `Thông báo khẩn`: Nền `#FEF4F4`, viền `#FCBBBE`, chữ `#B00810`.
     - `Thông tin sự kiện`: Nền `#FFF9EB`, viền `#FFE2A3`, chữ `#B45309`.
     - `Truyền thông nội bộ`: Nền `#F5F2FD`, viền `#D1C4F2`, chữ `#5F31D3`.
  3. **Huy hiệu số lượng (`Badge`) chuẩn `Tag / Colorful` của Figma**: Thay hình tròn màu xanh/đỏ gắt bằng pill bo tròn `height: 22px` nền pastel nhẹ giống hệt tag trên 4 thẻ Home.
  4. **Ẩn thẻ `Hoàn thành đọc bắt buộc` khi `totalMandatory === 0`** để không bao giờ hiện `0% (0/0)`.
  5. **Hỗ trợ nút thu gọn Sidebar (Collapse/Expand)** trên thanh Topbar để người dùng có thể mở rộng không gian đọc bất cứ lúc nào.

---

## VẤN ĐỀ 2: Tại sao hiện tại chưa thấy tính năng Đăng bài cho phần Thông báo khẩn như trên Mobile?

Qua đối chiếu trực tiếp mã nguồn Mobile (`permissions_model.dart`, `emergency_channel_view.dart`, `ai_social_inline_composer_card.dart`) với mã nguồn Web hiện tại, có **2 nguyên nhân gốc rễ (Root Causes)**:

### 2.1. Nguyên nhân #1 (Lỗi Mapping Quyền RBAC từ `/api/v1/me` khiến `canPublishInChannel('khan')` trả về `false`)

Khi bạn đăng nhập bằng tài khoản thật (**`Đồng Anh Vĩnh Cường — Trung tâm SP & TNXS`**), API `GET /api/v1/me` trả về cấu trúc JSON chuẩn của Backend như sau (xem `permissions_model.dart` dòng 64–93 trên Mobile):

```json
{
  "user": { "fullName": "Đồng Anh Vĩnh Cường", ... },
  "permissions": {
    "roles": ["admin", "emergency_broadcaster", "moderator", "publisher"],
    "publisherChannels": ["khan", "sukien", "truyenthong", "sotay"],
    "khanTypes": ["thien_tai", "dich_benh", "ha_tang_cntt", "an_ninh"],
    "sotayTypes": [...],
    "statsScopePaths": [...]
  }
}
```

- **Trên Mobile (`EffectivePermissions.canBroadcastEmergency`)**:
  ```dart
  bool get canBroadcastEmergency =>
      roles.contains('admin') ||
      roles.contains('emergency_broadcaster') ||
      roles.contains('moderator') ||
      roles.contains('publisher') ||
      publisherChannels.contains('khan') ||
      (khanTypes != null && khanTypes!.isNotEmpty);
  ```
- **Trên Web hiện tại (`AiSocialAuthService.canPublishInChannel`)**:
  Đang kiểm tra sai tên trường (`perms.canPublishChannels` thay vì `perms.publisherChannels`, kiểm tra `r.role` dạng object thay vì chuỗi `string` trong mảng `roles`, và thiếu kiểm tra `khanTypes` / `moderator` / `admin`).
  $\Rightarrow$ **Hệ quả**: Dù tài khoản `Đồng Anh Vĩnh Cường` có quyền trên mobile, hàm `canPublishInChannel('khan')` trên web vẫn trả về `false`, làm ẩn toàn bộ `<app-inline-composer-card>`!

### 2.2. Nguyên nhân #2 (Giao diện `InlineComposerCard` trên Web chưa giống bộ Composer Inline của Mobile)

Trên Mobile (`ai_social_inline_composer_card.dart` + `inline_composer_emergency_fields.dart` + `inline_composer_toolbar.dart`), bộ đăng bài ở kênh **Thông báo khẩn (`khan`)** không phải là một nút `"Soạn bài"` đóng kín mà là **Khung soạn thảo Inline trực tiếp đầu bảng tin**:

1. **Hàng nhập tiêu đề (`InlineComposerInputRow`)**:
   - Bên trái: Icon `composer_ai_avatar.svg` (`38×38px`).
   - Bên phải: Ô nhập không viền (`placeholder: "Viết thông báo khẩn..."` khi thu gọn, tự động đổi thành `"Tiêu đề thông báo khẩn..."` ngay khi click vào).
2. **Khối trường khẩn cấp mở rộng tự động khi click (`InlineComposerEmergencyFields`)**:
   - Đường kẻ mảnh `#F1F5F9`
   - Trường **`HIỆN TRẠNG (WHAT) *`**: `"Mô tả diễn biến, địa bàn hoặc sự cố đang xảy ra..."`
   - Đường kẻ mảnh `#F1F5F9`
   - Trường **`CẦN LÀM NGAY (ACTION) *`**: `"Chỉ đạo khẩn cấp, phương án ứng phó cho CBNV..."`
   - Đường kẻ mảnh `#F1F5F9`
   - Dải **Hashtag phân loại sự cố (`InlineComposerHashtagSelector`)**:
     - `# Thiên tai & bão lũ` (`thien_tai`)
     - `# Dịch bệnh & Y tế` (`dich_benh`)
     - `# Sự cố hạ tầng / Viễn thông` (`ha_tang_cntt`)
     - `# An toàn thông tin & cảnh báo khẩn` (`an_ninh`)
     - Khi chọn: nền `#FFF1F2`, viền `#FECDD3`, chữ & dấu `#` màu đỏ `#F52833`, kèm nút `"Bỏ chọn"`.
3. **Thanh công cụ dưới cùng luôn hiển thị (`InlineComposerToolbar`)**:
   - **Cụm 4 icon bên trái (`20×20px`)**:
     - Đính kèm tệp/ảnh/video (`composer_image.svg`)
     - Tạo bình chọn (`composer_list.svg`)
     - Chèn biểu tượng cảm xúc (`composer_emoji.svg`)
     - Đặt thời hạn đọc / lịch phát (`composer_calendar.svg`)
   - **Cụm bên phải**:
     - Pill phạm vi nhận tin **`🌐 Công khai`** / **`Đơn vị (+N)`** (`#F0F6FF` bg, `#0057E6` text, bấm để mở popup chọn đơn vị nhận tin).
     - Vòng tròn đếm ký tự **`RadialCharacterCounter`** (`0/500`).
     - Nút **`Nháp (X)`** + **`Lưu nháp`** (hiện khi đã nhập chữ) + Nút **`Đăng bài`** (`#1D9BF0` khi đủ 3 trường Tiêu đề + Hiện trạng + Cần làm ngay, xám `#E6E8EB` khi chưa nhập đủ).

---

## 3. Quyết định Kiến trúc Đã Chốt & Kế hoạch Hành động (Sẵn sàng `/cook`)

> **Quyết định từ User**: Chọn **Phương án A — Bỏ hẳn Sidebar trái trên toàn bộ Web** (điều hướng 100% qua Trang chủ `/home` và nút `← Quay lại` giống hệt Mobile).

1. **Bỏ hẳn Sidebar trái & Tối ưu Top Header (`AiSocialShellComponent`)**:
   - Xoá hoàn toàn `<aside class="shell-sidebar">` bên trái trên mọi màn hình.
   - Chuyển thành một thanh **Top Header tinh gọn**:
     - Bên trái: Logo `assets/ai-social/logo.png` (`36×36px`) + tên thương hiệu **`VNPT AI Social`** (bấm vào quay thẳng về `/home`).
     - Bên phải: Nút Chuông thông báo + Avatar & thông tin người dùng (`Đồng Anh Vĩnh Cường — Trung tâm SP & TNXS`) + Nút Đăng xuất.
   - Giải phóng 100% chiều ngang cho `/home` và 4 màn hình kênh (`/channels/khan`, `/channels/sukien`, `/channels/truyenthong`, `/channels/sotay`), điều hướng hoàn toàn qua 4 thẻ kênh trên `/home` và nút `←` ở đầu mỗi kênh giống hệt Mobile.
2. **Sửa dứt điểm Logic RBAC (`AiSocialAuthService` & `RbacPermissions`)**:
   - Đồng bộ 100% logic `EffectivePermissions` từ `permissions_model.dart` (`roles: string[]`, `publisherChannels: string[]`, `khanTypes: string[]`, `sotayTypes: string[]`) để tài khoản thực nhận đúng quyền đăng bài trên kênh `khan` và các kênh khác.
3. **Nâng cấp `InlineComposerCardComponent` giống hệt Mobile `AiSocialInlineComposerCard`**:
   - Hiển thị trực tiếp hàng nhập `"Viết thông báo khẩn..."` (`composer_ai_avatar.svg` + input không viền) và thanh Toolbar dưới cùng (`4 icon` + pill `🌐 Công khai` + vòng đếm ký tự `RadialCharacterCounter` + nút `Nháp` / `Lưu nháp` / `Đăng bài`).
   - Khi click vào ô nhập trên kênh `khan`, tự động trượt mở 2 trường **`HIỆN TRẠNG (WHAT) *`**, **`CẦN LÀM NGAY (ACTION) *`** và dải 4 chip **`# Hashtag` phân loại sự cố khẩn cấp** (`# Thiên tai & bão lũ`, `# Dịch bệnh & Y tế`, `# Sự cố hạ tầng / Viễn thông`, `# An toàn thông tin & cảnh báo khẩn`).

