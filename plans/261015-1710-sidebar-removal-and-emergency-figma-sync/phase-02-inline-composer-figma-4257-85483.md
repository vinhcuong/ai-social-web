# Phase 02 — Nâng cấp `InlineComposerCardComponent` chuẩn Figma `4257:85483` (`Hình 3`)

## Context Links
- [brainstormer-261015-1706-emergency-channel-figma-exact-ui.md](../reports/brainstormer-261015-1706-emergency-channel-figma-exact-ui.md)
- Mobile Reference: `/Users/vinhcuong/Dev/mobile-GCN-2/mobileapp/STM/packages/gcn_ai_social/lib/src/presentation/widgets/composer/ai_social_inline_composer_card.dart`

## Overview
- **Priority**: High
- **Status**: Planned
- **Description**: Dựng lại `InlineComposerCardComponent` khớp 100% với thiết kế Figma `4257:85483` (`Hình 3`) và luồng tương tác của Mobile (`AiSocialInlineComposerCard`), sử dụng bộ SVG Action mới vừa tải về `src/assets/ai-social/emergency/`.

## Related Code Files
- `src/app/features/ai-social/components/composer/inline-composer-card/inline-composer-card.component.ts`
- `src/app/features/ai-social/components/composer/inline-composer-card/inline-composer-card.component.html`
- `src/app/features/ai-social/components/composer/inline-composer-card/inline-composer-card.component.scss`

## Implementation Steps
1. **Cấu trúc khung `composer-card` chuẩn Figma `4257:85483`**:
   - `width: 100%; max-width: 680px; padding: 12px 12px 12px 20px; border: 1px solid #CCD0D5; border-radius: 16px; background: #FFFFFF; display: flex; flex-direction: column; gap: 12px;`
2. **Hàng 1 — `Author` + Ô nhập trực tiếp (`#4257:85484`)**:
   - Bên trái: `assets/ai-social/emergency/composer-avatar.png` (`40×40px`).
   - Bên phải: Input không viền (`placeholder="Viết thông báo"` khi thu gọn, đổi thành `"Tiêu đề thông báo khẩn..."` khi mở rộng trên kênh `khan`; font `Inter 16px Regular`, `#000A1A`, placeholder `#667183`).
   - Khi click/focus vào input hoặc bấm nút `+` (`composer-add-circle.svg`), mở rộng khối trường chi tiết ngay bên dưới:
     - Với kênh `khan`:
       - Trường **`HIỆN TRẠNG (WHAT) *`**: `"Mô tả diễn biến, địa bàn hoặc sự cố đang xảy ra..."`
       - Trường **`CẦN LÀM NGAY (ACTION) *`**: `"Chỉ đạo khẩn cấp, phương án ứng phó cho CBNV..."`
       - Dải 4 chip `# Hashtag` phân loại sự cố (`thien_tai`: `# Thiên tai & bão lũ`, `dich_benh`: `# Dịch bệnh & Y tế`, `ha_tang_cntt`: `# Sự cố hạ tầng / Viễn thông`, `an_ninh`: `# An toàn thông tin & cảnh báo khẩn`).
       - Ô chọn thời hạn đọc (`Đọc xong trước ...`) khi bật lịch.
3. **Hàng 2 — Thanh Action Toolbar dưới cùng luôn hiển thị (`#4257:85490`)**:
   - **Cụm 4 nút icon bên trái (`#4397:185128`, `gap: 2px`)**:
     1. `composer-attachment-02.svg` (`20×20px`): Mở hộp chọn tệp đính kèm (`PDF, DOC, XLS, Ảnh, Video`).
     2. `composer-tag-01.svg` (`20×20px`): Mở/ẩn dải chọn thẻ phân loại `# Hashtag`.
     3. `composer-smile.svg` (`20×20px`): Mở bảng chọn nhanh biểu tượng cảm xúc (`🚨`, `⚠️`, `📢`, `🩸`, `✅`, `📌`, `🔥`, `💡`) chèn vào nội dung.
     4. `composer-calendar-03.svg` (`20×20px`): Mở/ẩn trường chọn thời hạn đọc (`Đọc xong trước`) hoặc thời gian sự kiện.
   - **Cụm nút bên phải (`#4397:185133` + `#4257:85497`)**:
     1. Nút **`Toàn công ty`** (`#4397:185135`): Nền `#F0F6FF`, bo góc `6px`, `padding: 6px 8px`, `gap: 4px`, icon `composer-building-06.svg` (`20×20px`) + chữ `14px Medium #0057E5` (click để bật/tắt chọn đơn vị nhận tin).
     2. Vạch ngăn cách dọc (`height: 24px`, `1px solid rgba(0, 0, 0, 0.1)`).
     3. Nút **`composer-add-circle.svg`** (`32×32px`, `padding: 6px`, click để mở rộng/thu gọn các trường chi tiết).
     4. Nút **`Đăng bài`** (`#4257:85497`): `padding: 8px 12px`, `border-radius: 8px`, `16px Medium`; trạng thái disabled nền `#E6E8EB` chữ `#8C94A1`, trạng thái sẵn sàng đăng nền `#0057E5` chữ `#FFFFFF`.

## Todo List
- [ ] Cập nhật template `inline-composer-card.component.html` theo chuẩn Figma `4257:85483` (`Hình 3`)
- [ ] Cập nhật style `inline-composer-card.component.scss`
- [ ] Bổ sung helper chọn nhanh Emoji / Tag / Hạn đọc trong `inline-composer-card.component.ts` (giữ `<= 200` dòng)
