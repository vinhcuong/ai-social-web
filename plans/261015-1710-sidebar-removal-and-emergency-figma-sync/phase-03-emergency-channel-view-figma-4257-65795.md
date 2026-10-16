# Phase 03 — Chuẩn hoá `EmergencyChannelViewComponent` chuẩn Figma `4257:65795` (`Hình 2`)

## Context Links
- [brainstormer-261015-1706-emergency-channel-figma-exact-ui.md](../reports/brainstormer-261015-1706-emergency-channel-figma-exact-ui.md)
- Figma Node: `4257:65795` (`#4257:65797` Header, `#4257:65817` Urgent Card, `#4257:65852` Standard/Periodic Card)

## Overview
- **Priority**: High
- **Status**: Planned
- **Description**: Làm mới hoàn toàn giao diện trang `Thông báo khẩn` (`EmergencyChannelViewComponent`) để khớp chính xác với Figma `4257:65795` (`Hình 2`), khắc phục triệt để lỗi tràn tên file đính kèm, sai kích thước thumbnail, thiếu chữ trên nút `Chia sẻ` / `Copy link`, và sai màu pill tag.

## Related Code Files
- `src/app/features/ai-social/views/channels/emergency-channel-view/emergency-channel-view.component.ts`
- `src/app/features/ai-social/views/channels/emergency-channel-view/emergency-channel-view.component.html`
- `src/app/features/ai-social/views/channels/emergency-channel-view/emergency-channel-view.component.scss`
- `src/app/features/ai-social/services/ai-social-seed-posts.data.ts`

## Implementation Steps
1. **Header Kênh Thông Báo Khẩn (`#4257:65797`)**:
   - Thanh ngang đầu trang (`padding: 0 0 12px`, `border-bottom: 1px solid #E1E9F4`, `display: flex; justify-content: space-between; align-items: center`).
   - Cụm trái: Nút tròn `40×40px` (`arrow-left-01.svg` `24×24px`) + Cột tiêu đề `"Thông báo khẩn"` (`18px SemiBold #000A1A`) & phụ đề `"Sự cố, an ninh mạng, chỉ đạo gấp"` (`12px Medium #667183`).
   - Cụm phải: Pill thương hiệu viền gradient xanh (`padding: 4px 8px`, `border-radius: 100px`, `logo.png` `16×16px` + `"VNPT AI Social"`).
2. **Khung Thẻ Bài Viết (`#4257:65817` & `#4257:65852` — `Hình 2`)**:
   - Khung thẻ: `width: 100%; max-width: 680px; padding: 12px; border: 1px solid #CCD0D5; border-radius: 16px; background: #FFFFFF; display: flex; flex-direction: column; gap: 12px;`
   - **Khối Header ngang (`#4257:65819` / `#4257:65854`, `display: flex; gap: 12px; align-items: flex-start`)**:
     - **Thumbnail bên trái (`110×110px`, `border-radius: 12px`, `background: #F0F6FF`)**:
       - Hiển thị `assets/ai-social/emergency/tin-khan.png` cho bài đang phát khẩn cấp, hoặc `assets/ai-social/emergency/tin-thuong.png` cho bài thông báo định kỳ / đã kết thúc (như `Hình 2`).
     - **Cột phải (`flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 8px`)**:
       - **Hàng trên (`Tag` + `Button`)**:
         - Trái:
           - Nếu bài khẩn đang phát: Pill **`Đang phát`** (`background: #F0F6FF; border: 1px solid #C7DCFF; color: #0057E5; height: 24px; padding: 0 8px; border-radius: 100px`) kèm `megaphone-01.svg` (`16×16px`).
           - Nếu có `categoryCode`: Pill `# Chuyên mục` (`background: #FFF1F2; border: 1px solid #FECDD3; color: #E11D48`).
           - Pill đối tượng nhận **`Toàn công ty`** (`background: #F5F2FD; border: 1px solid #D1C4F2; color: #5F31D3; height: 24px; padding: 0 10px; border-radius: 100px; font-size: 12px; font-weight: 500`).
         - Phải (`gap: 4px`):
           - Nút **`Chia sẻ`**: `padding: 6px 8px; border: 1.5px solid #E6E8EB; border-radius: 6px; background: #FFFFFF; color: #404D64; font-size: 14px` kèm `share-03.svg` (`20×20px`).
           - Nút **`Copy link`**: `padding: 6px 8px; border: 1.5px solid #E6E8EB; border-radius: 6px; background: #FFFFFF; color: #404D64; font-size: 14px` kèm `link-04.svg` (`20×20px`).
       - **Khối Tiêu đề & Sub (`#4257:65830` / `#4257:65863`, `gap: 4px`)**:
         - Tiêu đề (`h2`): `font-size: 16px; font-weight: 600; line-height: 24px; color: #000000; margin: 0;`
         - Dòng Sub (`font-size: 14px; line-height: 20px; display: flex; flex-wrap: wrap; align-items: center; gap: 8px`):
           - `Thời gian đăng:` (`#8C94A1`) + `HH:mm` (`#404D64`)
           - Nếu có `deadline`: chấm tròn `4×4px #B3B8C1` + `Đọc xong trước ...` (`#404D64`)
           - Chấm tròn `4×4px #B3B8C1` + `Người đăng:` (`#8C94A1`) + Tên người đăng (`#404D64`)
3. **Khối Thông Tin `info-detail` (`#4257:65874` — Nền `#F8F8F8` phẳng, không kẻ bảng)**:
   - `background: #F8F8F8; border-radius: 12px; padding: 12px 16px; display: flex; flex-direction: column; gap: 8px;` (bỏ hoàn toàn `border` và `border-bottom`).
   - Hỗ trợ hiển thị thông minh:
     - Nếu bài viết có `what` và `action` riêng biệt: hiển thị dòng `Hiện trạng:` và `Cần làm ngay:` (màu chữ `#1A2A45`, không tô đỏ).
     - Nếu bài viết chỉ có `Nội dung` chung (hoặc `what` trùng `body` và không có `action` riêng): hiển thị dòng **`Nội dung:`** (`width: 106px`, `#667183`) + Nội dung rich text/markdown (`#1A2A45`) đúng như `Hình 2`!
   - **Dòng `Đính kèm:` (`#4257:65879`)**:
     - Cột trái: `Đính kèm:` (`width: 106px`, `#667183`).
     - Cột phải (`flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 8px`):
       - Mỗi tệp là một hộp `File Upload` (`#4257:65882`):
         - `padding: 8px; border-radius: 8px; background: rgba(0, 0, 0, 0.05); border: 1px solid #E6E8EB; display: flex; align-items: center; gap: 8px; min-width: 0;`
         - Icon `file-pdf-24.svg` (`24×24px`, `flex-shrink: 0`).
         - Khối tên + dung lượng (`flex: 1; min-width: 0`):
           - Tên file (`14px Medium #000A1A`, `white-space: nowrap; overflow: hidden; text-overflow: ellipsis;` — **chống tràn tuyệt đối với chuỗi hash dài**).
           - Dung lượng (`12px Regular #404D64`).
         - Nút tải xuống (`32×32px`, `download-04.svg` `20×20px`, `flex-shrink: 0`).
4. **Chân Thẻ (`Note` `#4257:84986`)**:
   - `display: flex; align-items: center; justify-content: flex-end; gap: 8px;` (căn phải chuẩn Figma, kèm nút xác nhận đọc gọn đẹp khi bài bắt buộc chưa đọc).
   - Hiển thị `{{ post.readCount }} / {{ post.recipientCount }} đã đọc` (`14px Regular #404D64`) + chấm tròn `8×8px #B3B8C1` + nút `Danh sách chi tiết` (`14px Medium #0062E1`).

## Todo List
- [ ] Cập nhật `emergency-channel-view.component.html` chuẩn Figma `4257:65795` (`Hình 2`)
- [ ] Cập nhật `emergency-channel-view.component.scss` (thumbnail `110×110px`, pill `#F5F2FD`, hộp `#F8F8F8` không viền kẻ, chống tràn tên file đính kèm, footer căn phải)
- [ ] Cập nhật `emergency-channel-view.component.ts` & dữ liệu mẫu trong `ai-social-seed-posts.data.ts` khớp nội dung Figma (`Cảnh báo email giả mạo...` & `Thông báo khám sức khoẻ định kỳ`)
