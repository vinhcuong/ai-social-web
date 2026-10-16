---
title: "Brainstorm: Composer Enhancements - Auto-expand Textarea, Multi-select Emoji Popover & Figma Schedule Modal"
description: "Thiết kế giải pháp nâng cấp bộ soạn thảo: Xóa resize handle, tự co giãn textarea, Emoji Picker Overlay đa chọn và đồng bộ Modal Lên lịch đăng bài chuẩn Figma 3.1."
status: decided
topic: "composer-textarea-emoji-schedule-figma-sync"
chosen_option: "Option 1: Modular Subcomponents (EmojiPickerPopover + PostScheduleModal) with CSS/AutoGrow Textarea"
date: 2026-10-16
tags: [frontend, angular22, composer, figma-sync, ui-ux, schedule, emoji]
---

# Brainstorm Report: Nâng cấp Bộ Soạn thảo (Textarea Auto-grow, Emoji Overlay & Figma Schedule)

## Executive Summary

Người dùng yêu cầu giải quyết 4 điểm cốt lõi trong bộ soạn thảo bài đăng AI Social:
1. **Xóa bỏ nút kéo dãn/thu nhỏ textfield**: Ẩn triệt để góc resize native xấu xí của trình duyệt.
2. **Textfield tự động mở rộng theo nội dung (Auto-expand)**: Chiều cao textarea tự động co giãn theo số dòng người dùng nhập hoặc dán.
3. **Emoji Picker Overlay**: Bấm icon mặt cười mở bảng popover chọn biểu tượng cảm xúc (có ô tìm kiếm, phân loại danh mục, và **cho phép chọn liên tiếp nhiều icon** mà không bị đóng popup).
4. **Loại bỏ giới hạn thời gian ("Đọc xong trước") & Thay bằng Tính năng Lên lịch chuẩn Figma**:
   - Khai tử ô deadline cũ trong thông báo khẩn.
   - Hiện thực hóa Modal **"Lên lịch"** chuẩn Figma Desktop 3.1:
     - Header & Banner thông báo dynamic: `Sẽ gửi về thứ X, DD/MM/YYYY lúc HH:mm:ss`.
     - Bộ chọn Ngày với **Calendar tháng** (Node `#4537:42280`).
     - Bộ chọn Giờ với **Time picker** (Node `#4537:42815`).
     - Nút xác nhận & chuyển đổi nút đăng thành **"Lên lịch"** gửi `scheduledPublishAt`.

---

## Context & Objectives

### 1. Phân tích Hiện trạng
- **Textarea**: Đang set `resize: vertical;` và `rows="2"|"3"`, khiến trình duyệt hiển thị icon góc kéo `//` xấu xí, người dùng gõ dài bị cuộn nội dung cụt lủn.
- **Emoji**: Nút icon mặt cười hiện chưa có popover, chỉ là nút placeholder.
- **Thời hạn đọc cũ**: Ô `calendar-picker-row` ghi "Đọc xong trước: ..." không phù hợp với nghiệp vụ thông báo khẩn thời gian thực và chưa đồng bộ tính năng lên lịch bài đăng của hệ thống.
- **Giới hạn số dòng code (Rule <200 lines)**: File `inline-composer-card.component.ts` hiện đã ở mức ~198 dòng. Nếu nhồi nhét toàn bộ logic Calendar, Time Picker, Emoji Picker vào 1 component sẽ vi phạm nghiêm trọng quy chuẩn kiến trúc của dự án.

---

## Phân tích Chi tiết 4 Yêu cầu & Thiết kế UI/UX

### Yêu cầu 1 & 2: Triệt tiêu Resize Handle & Auto-grow Textarea
- **Giải pháp CSS + Micro-directive**:
  ```scss
  .borderless-textarea {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    resize: none !important;              /* Triệt tiêu 100% resize handle */
    field-sizing: content;                /* Chuẩn CSS hiện đại tự mở rộng theo nội dung */
    min-height: 44px;
    max-height: 320px;
    overflow-y: auto;
    font-size: 14px;
    line-height: 20px;
    &::-webkit-resizer { display: none; }
  }
  ```
  Kết hợp hàm `onInputAutoGrow(target: HTMLTextAreaElement)`:
  ```typescript
  onInputAutoGrow(el: HTMLTextAreaElement): void {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 320) + 'px';
  }
  ```
- **Kết quả**: Không có góc kéo xấu xí; gõ đến đâu khung mở rộng mượt mà đến đó.

---

### Yêu cầu 3: Emoji Picker Overlay (Hỗ trợ chọn nhiều icon liên tiếp)
Dựa trên Hình 2 mà người dùng cung cấp:
- **Cấu trúc Popover**:
  ```text
  ┌──────────────────────────────────────────────────┐
  │  🔍 Tìm kiếm emojis                              │
  ├──────────────────────────────────────────────────┤
  │  🕒   🙂   🐱   🍔   ⚽   🚗   💡   🚩       │
  ├──────────────────────────────────────────────────┤
  │  😀  😃  😄  😁  😆  😅  😂  🤣  😇  😉       │
  │  😊  😋  😎  😍  😘  🥰  😗  😙  😚  🙂       │
  │  🤗  🤩  🤔  🤨  😐  😑  😶  🙄  😏  😣       │
  │  😥  😮  🤐  😯  😪  😫  🥱  😴  😌  😛       │
  │  😜  😝  🤤  😒  😓  😔  😕  🙃  🤑  😲       │
  │  ⚠️  🚨  ⚡  🔥  📢  📌  ✅  ❌  📝  📅       │
  └──────────────────────────────────────────────────┘
  ```
- **Hành vi Multi-select**:
  - Khi click vào 1 emoji:
    1. Chèn emoji vào vị trí con trỏ (hoặc nối tiếp vào trường văn bản đang active: `whatHappened` hoặc `actionRequired` hoặc `body`).
    2. **KHÔNG** đóng popover overlay. Người dùng có thể nhấn liên tục: `🚨`, `⚠️`, `📢`.
    3. Popover chỉ đóng khi người dùng:
       - Click ra ngoài (Click outside).
       - Hoặc bấm lại vào nút icon mặt cười trên toolbar.
- **Tính năng tìm kiếm**: Lọc nhanh emoji theo từ khóa tiếng Việt và tiếng Anh (vd: "cười", "cảnh báo", "cháy", "fire", "warning", "smile").

---

### Yêu cầu 4: Modal Lên lịch chuẩn Figma Desktop 3.1
Khảo sát trực tiếp qua MCP Figma API:
- **Node #4496:33933 (Lên lịch Modal)**:
  - Width: ~600px - 700px, `borderRadius: 12px`, padding `20px`.
  - **Banner thông báo `#DBE9FF`**:
    - Icon `calendar-03` + Text font 16px SemiBold: `"Sẽ gửi về thứ {X}, {DD/MM/YYYY} lúc {HH:mm:ss}"`.
  - **Trường chọn Ngày (Node #4496:33944)**:
    - Input phân đoạn: Ngày / Tháng / Năm + button icon `calendar-03`.
    - Click mở **Calendar tháng** (Node `#4537:42280`).
  - **Trường chọn Giờ (Node #4496:33948)**:
    - Input phân đoạn: Giờ / Phút + button icon `clock-01`.
    - Click mở **Time picker** (Node `#4537:42815`).
  - **Footer (Node #4496:33951)**:
    - Nút trái: `"Bài viết đã lên lịch"` (style `#F0F6FF`, text `#0057E5`, icon calendar) / hoặc nút `"Huỷ lịch"` nếu đã đặt.
    - Nút phải: `"Xác nhận"` (primary blue `#0057E5`, color `#FFFFFF`).

- **Node #4537:42280 (Calendar Tháng Popover)**:
  - Header: Nút lùi tháng `←`, nhãn `"Tháng M YYYY"`, nút tiến tháng `→`.
  - Thứ trong tuần: `T2, T3, T4, T5, T6, T7, CN`.
  - Grid ngày:
    - Ngày tháng trước/sau: màu xám mờ `#8C94A1`.
    - Ngày trong tháng: màu chữ `#1A2A45`.
    - Ngày hiện tại (Today): nền pill `#F0F6FF`, chữ xanh `#0057E5`.
    - Ngày được chọn (Selected): hình tròn bo 40px, nền xanh `#0057E5`, chữ trắng `#FFFFFF`.

- **Node #4537:42815 (Time Picker Popover)**:
  - Layout: Bảng chọn dọc 3 cột (Giờ `00-23`, Phút `00-59`, AM/PM hoặc 24h).
  - Vùng được chọn ở giữa: Nền highlight `#F0F6FF`, bo góc `4px`, chữ 16px Medium `#404D64`.
  - Footer của popover: Nút "Hủy" (outline) và "Xác nhận" (primary blue).

- **Tích hợp ngược vào Composer**:
  - Khi đã chọn lịch:
    - Hiển thị chip lịch hẹn trên thanh công cụ: `📅 Lên lịch: 08:00 - 12/10/2026 [Xoá]`.
    - Nút submit chính đổi từ **"Đăng bài"** thành **"Lên lịch"**.
    - Payload gửi đi: `{ ...payload, scheduledPublishAt: isoDateString, status: 'scheduled' }`.

---

## Evaluated Options & Kiến trúc Module

### Option 1: Kiến trúc Tách Module Chuyên biệt (Recommended)
Tạo 2 component con độc lập trong thư mục `composer/`:
1. `EmojiPickerPopoverComponent` (`src/app/features/ai-social/components/composer/emoji-picker-popover/`):
   - Quản lý danh mục, tìm kiếm, emoji grid, multi-select event `emojiSelect = output<string>()`.
   - Dung lượng: ~120 dòng code.
2. `PostScheduleModalComponent` (`src/app/features/ai-social/components/composer/post-schedule-modal/`):
   - Đóng gói toàn bộ Figma Node #4496:33933, #4537:42280, #4537:42815.
   - Dung lượng: ~170 dòng code.
3. `InlineComposerCardComponent`:
   - Chỉ import và liên kết 2 component trên, loại bỏ `deadlineText` cũ, áp dụng CSS auto-grow.
   - Giữ dung lượng file luôn **dưới 170 dòng code** (đáp ứng trọn vẹn quy tắc <200 lines).

### Option 2: Viết dồn toàn bộ vào `InlineComposerCardComponent`
- Nhồi nhét cả Calendar, Time Picker, Emoji Grid vào 1 file duy nhất.
- **Hậu quả**: File sẽ phình to lên >450 dòng, vi phạm quy chuẩn dự án (`GEMINI.md`: File size < 200 lines), cực kỳ khó bảo trì và dễ sinh lỗi xung đột state.

---

## Trade-off Matrix

| Tiêu chí | **Option 1: Tách Module Con (Recommended)** | Option 2: Viết dồn 1 file |
|---|---|---|
| **Tuân thủ Giới hạn < 200 dòng** | **5/5** (Mỗi file ~100-170 dòng) | 1/5 (Phình to >450 dòng) |
| **Độ khớp Figma 3.1** | **5/5** (Tái tạo 100% Node 4496, 4537) | 3/5 (Dễ bị cắt xén UI do quá tải) |
| **Khả năng Tái sử dụng** | **5/5** (Modal Lên lịch & Emoji dùng lại cho Kênh Sự kiện, Truyền thông) | 1/5 (Bị khóa cứng trong Inline Composer) |
| **Trải nghiệm chọn Emoji** | **5/5** (Chọn nhiều icon liên tục, tìm kiếm mượt) | 3/5 |
| **Thời gian triển khai** | **~2.5 - 3 giờ** | ~2 giờ (nhưng nợ kỹ thuật nặng) |

---

## Final Decision & Rationale

- **Quyết định**: Chọn **Option 1**.
- **Lý do**:
  1. Đảm bảo 100% các tiêu chuẩn kiến trúc: Files dưới 200 dòng, OnPush change detection, Signals phản ứng nhanh.
  2. Đáp ứng chuẩn xác từng chi tiết thiết kế Figma từ màu sắc `#DBE9FF`, font chữ Inter, tới các góc bo `12px` và hiệu ứng hover.
  3. Xóa bỏ hoàn toàn "Đọc xong trước" theo đúng định hướng nghiệp vụ khẩn cấp; bổ sung năng lực hẹn giờ phát tin chuyên nghiệp.

---

## Next Steps

1. Trình người dùng báo cáo brainstorm để duyệt kế hoạch.
2. Kích hoạt `/cook` để hiện thực hóa:
   - Module `EmojiPickerPopoverComponent`
   - Module `PostScheduleModalComponent` (kèm Month Calendar + Time Picker)
   - Cập nhật `InlineComposerCardComponent` (auto-expand textarea & xóa deadline cũ).
