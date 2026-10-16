---
title: "Brainstorm: Đồng bộ Giao diện Chi tiết & Thống kê Tương tác (Figma Node #4361:14403)"
description: "Phân tích khoảng cách giữa Hiện trạng và Thiết kế Figma 3.1 Desktop cho Modal Chi tiết Tương tác Bài viết, đề xuất kiến trúc và giải pháp kỹ thuật tái cấu trúc."
status: decided
topic: "post-interaction-details-modal-figma-sync"
chosen_option: "Option 1: Tái cấu trúc chuẩn Figma 3.1 Desktop với Kiến trúc Modular hóa (<200 LOC/file)"
date: 2026-10-16
tags: [figma, modal, post-details, stats, ai-social-web, interaction-kpi]
---

# Brainstorm Report: Đồng bộ Giao diện Chi tiết & Thống kê Tương tác Bài viết

## Executive Summary
Giao diện xem chi tiết & thống kê tương tác hiện tại (`post-stats-modal.component`) đang dùng layout cũ dạng KPI thô (4 box thống kê rời rạc + 2 tab chung) không phản ánh đúng thiết kế Figma 3.1 Desktop (`node-id=4361-14403`). Báo cáo này tiến hành mổ xẻ chi tiết từng thành phần giữa Hình 1 (Figma) và Hình 2 (Hiện trạng), thiết lập ma trận trade-off và chốt phương án tái cấu trúc toàn diện modal nhằm đạt chuẩn Pixel-Perfect, tối ưu hóa trải nghiệm người dùng và tuân thủ giới hạn <200 LOC/file.

---

## 1. So sánh Đối chiếu Hiện trạng vs Thiết kế Figma (Hình 1 vs Hình 2)

| Thành phần giao diện | Hình 1: Figma Node #4361:14403 | Hình 2: Hiện trạng (`ai-social-web`) | Đánh giá & Khoảng cách |
|---|---|---|---|
| **Kích thước Modal** | Rộng linh hoạt (designedWidth: 1200px / desktop view ~860-960px), bo góc `12px`, padding `20px` | Rộng cố định `720px`, bo góc `16px`, padding lộn xộn | Hiện trạng quá hẹp, chật chội khi hiển thị danh sách phòng ban và tương tác |
| **Thanh Header trên cùng** | Trái: Pill tag `Thông báo khẩn` (icon loa, bg `#FEEBEC`, stroke `#FCBBBE`, text đỏ `#F52833`). Phải: Mini progress bar (99x6px), text `182/230 đã đọc`, chấm `•`, deadline `Đọc xong trước 11:00`, nút `✕` | Tiêu đề text thô `Danh sách chi tiết & Thống kê tương tác`, subtitle là tên bài viết, nút đóng `✕` thô sơ | Lệch hoàn toàn bố cục header, thiếu tag loại tin, thiếu progress bar và deadline đọc |
| **Card tóm tắt bài viết** | Banner gradient `linear-gradient(90deg, #F0F7FE 0%, #E7F2FE 100%)`, viền `#DBE9FF`, bo góc `12px`, padding `12px`. Thumbnail 64x64px + Tiêu đề 20px SemiBold + Thời gian đăng + Người đăng | Hoàn toàn không có card banner tóm tắt bài viết; chỉ hiển thị 4 ô KPI thô | Thiếu context trực quan của bài viết đang xem thống kê |
| **Tab phân loại tương tác** | 4 tab kèm số lượng: `Đã đọc (182)`, `Thả tim (125)` (active tab nền xanh `#DBE9FF`, badge đỏ `#F52833`), `Đã chia sẻ (23)`, `Chưa đọc (48)`. Ngăn cách bởi vạch mờ | Chỉ có 2 tab cơ bản: `Theo phòng ban (0)` và `Danh sách người nhận (20)` | Sai mô hình phân loại tương tác theo hành vi người dùng (Đã đọc / Tim / Chia sẻ / Chưa đọc) |
| **Ô tìm kiếm danh sách** | Ô input search bên phải hàng tab: Rộng 180px, cao 40px, icon kính lúp `#B3B8C1`, placeholder `Tìm kiếm` | Ô input tìm kiếm đặt bên trong tab `Danh sách người nhận`, lệch layout | Cần đưa lên cùng hàng với 4 tab tương tác |
| **Bộ lọc Đơn vị / Phòng ban** | Hàng pill nút bấm bo tròn (`border-radius: 100px`): `Tất cả` (active xanh `#F0F6FF`, border `#C7DCFF`) + từng đơn vị kèm số lượng `Ban Quản trị & Nhân sự (2)`, v.v. | Dạng danh sách thanh progress từng phòng ban thô sơ | Cần chuyển sang dạng Pill Filter linh hoạt kết hợp với danh sách nhân sự |
| **Danh sách nhân sự & tương tác** | Khung viền `#E1E9F4`, bo góc 8px, shadow nhẹ. Mỗi hàng gồm: Avatar tròn 32px, Tên (14px Medium), Chức danh (12px Regular), Giờ tương tác (16px), Icon `tick-double-01` (xanh dương) và Icon `favourite` (trái tim đỏ) | Hàng nhân sự chỉ có avatar chữ cái, không có icon đã đọc kép, không có icon thả tim, không có mốc thời gian chi tiết | Thiếu toàn bộ icon trạng thái tương tác và timestamp chuẩn |
| **Footer hành động** | Nằm giữa, có viền trên `#E6E8EB`. Gồm 2 nút chuẩn: `Đóng` (Outline xanh `#0057E5`) và `Xuất Excel` (Solid xanh `#0057E5`) | Không có footer. Nút nhắc nhở bị nhét bừa lên hàng KPI | Thiếu footer tiêu chuẩn và tính năng Xuất Excel |

---

## 2. Đặc tả Kỹ thuật Chi tiết từ Figma Token & Nodes

### 2.1. Modal Shell & Header
* **Modal Dialog**:
  - `max-width: 960px; width: 100%;`
  - `border-radius: 12px; padding: 20px; background: #FFFFFF;`
* **Header Bar**:
  - **Tag Loại kênh/Khẩn cấp**:
    - Nền: `#FEEBEC`, Viền: `1px solid #FCBBBE`, Chữ: `#F52833`, Font: `Inter 12px Medium`
    - Icon dẫn đầu: `assets/ai-social/emergency/megaphone-01.svg` (16x16px)
  - **Cụm tiến độ & Thời hạn**:
    - Progress track: Rộng `99px`, cao `6px`, bo cong `100px`, nền `#E2E8F0` / fill xanh `#0057E5`
    - Read count: `182/230` (bold, `#0057E5`) + ` đã đọc` (`#404D64`)
    - Chấm phân cách: `4x4px`, màu `#CCD0D5`
    - Deadline text: `Đọc xong trước 11:00` (hoặc lấy từ `post.registrationDeadline` / `endedAt`)
    - Nút đóng: Icon `✕` (24x24px, color `#667183`, hover `#000A1A`)

### 2.2. Post Summary Banner Card
* **Container**:
  - Nền: `linear-gradient(90deg, #F0F7FE 0%, #E7F2FE 100%)`
  - Viền: `1px solid #DBE9FF`, Bo góc: `12px`, Padding: `12px`
* **Thumbnail**:
  - Kích thước: `64x64px`, bo góc `12px`, `object-fit: cover`
  - Fallback nếu không có ảnh: Banner thumbnail mặc định của kênh khẩn cấp
* **Nội dung tóm tắt**:
  - Tiêu đề bài viết: `font-size: 20px; font-weight: 600; color: #000A1A; line-height: 28px;`
  - Metadata:
    - `Thời gian đăng:` (`#8C94A1`) + `[HH:mm / DD/MM/YYYY]` (`#404D64`)
    - Chấm phân cách `•`
    - `Người đăng:` (`#8C94A1`) + `[Tên tác giả]` (`#404D64`)

### 2.3. Hàng Tab Tương tác & Ô Tìm kiếm
* **4 Tabs tương tác**:
  1. `Đã đọc`: Hiển thị số lượng (tag xám hoặc text)
  2. `Thả tim`: Tag badge đỏ `#F52833`, chữ trắng khi active, nền tab xanh `#DBE9FF`
  3. `Đã chia sẻ`: Tag số lượng
  4. `Chưa đọc`: Tag số lượng cảnh báo
* **Search input**:
  - Kích thước: `width: 180px; height: 40px;`
  - Border: `1px solid #CCD0D5`, Bo góc: `8px`
  - Icon: Kính lúp (20x20px), Placeholder: `"Tìm kiếm"`

### 2.4. Hàng Bộ lọc Phòng ban (Department Pills)
* Danh sách pill cuộn/wrap:
  - Nút `Tất cả`: Khi active có fill `#F0F6FF`, viền `#C7DCFF`, chữ xanh `#0057E5`
  - Từng phòng ban: Fill `#FFFFFF`, viền `#E6E8EB`, chữ `#404D64`, hiển thị tên + `(số lượng)`
  - Cho phép người dùng click để lọc danh sách nhân sự tương ứng của phòng ban đó

### 2.5. Danh sách Tương tác & Trạng thái Nhân sự
* Khung bảng danh sách: Viền `1px solid #E1E9F4`, bo góc `8px`, bóng đổ nhẹ `0 4px 10px rgba(0,0,0,0.05)`, padding `12px 16px`.
* Mỗi hàng người dùng:
  - **Trái**: Avatar tròn 32x32px (hoặc fallback chữ cái đầu) + Tên nhân sự (14px Medium `#1A2A45`) + Chức danh/Đơn vị (12px Regular `#667183`)
  - **Phải**:
    - Timestamp: Định dạng linh hoạt (`10:57`, `Hôm qua lúc 10:01`, `06/10/2026 lúc 08:00`)
    - Trạng thái `tick-double-01`: Hai dấu tích xanh dương `#0057E5` biểu thị đã đọc
    - Trạng thái `favourite`: Trái tim đỏ `#F52833` biểu thị đã thả tim
    - Khi ở tab `Chưa đọc`: Có thể tích hợp nút nhắc nhở trực tiếp từng cá nhân

### 2.6. Footer Actions
* Căn giữa, viền trên `1px solid #E6E8EB`, padding top `16px`.
* Nút 1: `Đóng` — Border `1.5px solid #0057E5`, màu chữ `#0057E5`, nền trong suốt, kích thước 131x40px.
* Nút 2: `Xuất Excel` — Nền xanh `#0057E5`, chữ trắng `#FFFFFF`, kích thước 131x40px, tích hợp hàm xuất báo cáo danh sách tương tác ra file `.xlsx` hoặc `.csv`.

---

## 3. Các Phương án Triển khai (Evaluated Options)

### Option 1: Tái cấu trúc chuẩn Figma 3.1 với Kiến trúc Modular hóa (Khuyến nghị)
* **Ý tưởng**:
  - Thay thế toàn bộ layout HTML/SCSS của `PostStatsModalComponent` theo đúng 100% Figma node `#4361:14403`.
  - Giữ các hàm helper (định dạng ngày giờ, xuất CSV/Excel) gãy gọn để đảm bảo `post-stats-modal.component.ts` < 180 lines và `post-stats-modal.component.html` < 180 lines theo đúng quy tắc `GEMINI.md`.
  - Giữ lại đầy đủ các API sẵn có (`getPostDepartmentBreakdown`, `getPostRecipients`, `remindPost`), bổ sung mapping dữ liệu phản hồi (reactions, share count, timestamps).
* **Ưu điểm**:
  - Giao diện đạt chuẩn Pixel-Perfect với Figma 3.1 Desktop.
  - Trải nghiệm chuyên nghiệp, đúng nghiệp vụ quản trị truyền thông & khẩn cấp.
  - Code sạch sẽ, dễ bảo trì, tuân thủ nguyên tắc Clean Code và giới hạn dòng của dự án.
* **Nhược điểm & Rủi ro**: Cần trau chuốt CSS flexbox và responsive để modal hiển thị tốt trên màn hình nhỏ.

### Option 2: Vá chắp vá (In-place patch trên layout hiện tại)
* **Ý tưởng**: Giữ nguyên khung cũ, chỉ đổi màu và thêm vài nút bấm vào các ô KPI hiện tại.
* **Ưu điểm**: Tốn ít thời gian gõ code.
* **Nhược điểm & Rủi ro**:
  - Không giống Figma, người dùng và Product Owner sẽ tiếp tục yêu cầu sửa lại.
  - Layout chắp vá gây phình to file SCSS và HTML, vi phạm quy tắc <200 LOC của `GEMINI.md`.

---

## 4. Ma trận Đánh giá Trade-off

| Tiêu chí đánh giá | Option 1 (Khuyến nghị: Chuẩn Figma 3.1 Modular) | Option 2 (Vá trên layout cũ) |
|---|---|---|
| **Độ khớp thiết kế Figma (Visual Alignment)** | **100% Pixel-Perfect** | ~30% (Vẫn mang dáng dấp layout cũ) |
| **Trải nghiệm UX/UI** | **Xuất sắc**: Đầy đủ search, filter phòng ban, status tim/đọc | Trung bình, thiếu chiều sâu phân tích |
| **Tuân thủ Clean Code & <200 LOC** | **Đạt** (chia tách rõ ràng) | **Trượt** (dễ vượt 200 dòng do chắp vá) |
| **Tính mở rộng (Export Excel, Filter)** | **Cao** (kiến trúc sẵn sàng) | Thấp |
| **Rủi ro ảnh hưởng logic API** | **Thấp** (kế thừa trọn vẹn service hiện tại) | Thấp |

---

## 5. Quyết định & Đề xuất Kỹ thuật (Final Decision)

* **Phương án lựa chọn**: **Option 1 — Tái cấu trúc chuẩn Figma 3.1 Desktop**.
* **Lộ trình kỹ thuật**:
  1. Cập nhật [post-stats-modal.component.html](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/components/post-stats-modal/post-stats-modal.component.html) với cấu trúc 6 khối chuẩn: Header bar $\rightarrow$ Post summary banner $\rightarrow$ Tab tương tác + Search $\rightarrow$ Department filter pills $\rightarrow$ Recipient list with status badges $\rightarrow$ Footer buttons.
  2. Cập nhật [post-stats-modal.component.scss](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/components/post-stats-modal/post-stats-modal.component.scss) với bảng màu token GoConnect (`#0057E5`, `#F0F7FE`, `#DBE9FF`, `#FEEBEC`, `#F52833`, `#1A2A45`, `#404D64`).
  3. Cập nhật [post-stats-modal.component.ts](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/components/post-stats-modal/post-stats-modal.component.ts):
     - Quản lý tab active (`read` | 'heart' | 'share' | 'unread').
     - Bộ lọc phòng ban đang chọn (`selectedUnitId`).
     - Lọc danh sách nhân sự động theo cả tab tương tác, phòng ban và từ khoá tìm kiếm.
     - Hàm `exportExcel()`: Xuất danh sách tương tác sang CSV/Excel thân thiện với Excel tiếng Việt (UTF-8 BOM).
  4. Kiểm tra biên dịch `npm run build` để đảm bảo không có lỗi TypeScript hay template.

---

## 6. Các bước tiếp theo (Next Steps & Handoff)

1. [ ] Trình báo cáo brainstorm này cho người dùng duyệt.
2. [ ] Kích hoạt `/planning` để lập kế hoạch chi tiết từng bước.
3. [ ] Kích hoạt `/cook` để tiến hành lập trình thực tế vào `post-stats-modal.component.*`.
