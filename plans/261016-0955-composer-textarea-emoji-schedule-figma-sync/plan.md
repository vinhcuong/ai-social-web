---
title: "Plan: Composer Textarea Auto-grow, Emoji Picker Overlay & Figma Schedule Modal"
description: "Cải tiến bộ soạn thảo: Xóa resize textfield, tự co giãn, Emoji Picker Popover đa chọn và Modal Lên lịch đăng bài chuẩn Figma 3.1."
status: complete
priority: high
effort: 3h
branch: main
tags: [frontend, angular22, composer, figma-sync, ui-ux, schedule, emoji]
created: 2026-10-16
---

# Overview Plan: Nâng cấp Bộ Soạn thảo AI Social

Kế hoạch chia thành 2 phase chuyên biệt, tuân thủ nghiêm ngặt quy tắc file size < 200 dòng và tái hiện 100% thiết kế Figma Desktop 3.1:

| Phase | Nội dung | Mục tiêu & Thành phẩm | Trạng thái |
|---|---|---|---|
| **Phase 01** | [Textarea Auto-grow & Emoji Picker](./phase-01-textarea-and-emoji-picker.md) | Triệt tiêu resize handle, tự động giãn nở textarea, tạo `EmojiPickerPopoverComponent` hỗ trợ multi-select | Hoàn thành |
| **Phase 02** | [Figma Schedule Modal & Payload](./phase-02-figma-schedule-modal-and-payload.md) | Xóa "Đọc xong trước", tạo `PostScheduleModalComponent` (Node #4496, #4537), chuyển nút "Lên lịch" | Hoàn thành |

### Phụ thuộc chính
- Figma Nodes: `#4496:33933` (Schedule Modal), `#4537:42280` (Month Calendar), `#4537:42815` (Time Picker).
- Báo cáo khảo sát: [brainstormer-261016-0950-composer-textarea-emoji-schedule-figma-sync.md](../reports/brainstormer-261016-0950-composer-textarea-emoji-schedule-figma-sync.md).
