---
title: "Plan: Fix Emoji Popover Placement & Schedule Modal Invisible Dialog"
description: "Khắc phục triệt để lỗi Emoji Popover nhảy lên trên che khuất, xoá tip dư thừa và sửa lỗi Modal Lên lịch bị giam trong containing block backdrop-filter bằng nz-modal teleport."
status: complete
priority: high
effort: 1.5h
branch: main
tags: [composer, ui-fix, emoji-popover, schedule-modal, ng-zorro, figma-sync]
created: 2026-10-16
---

# Overview Plan: Sửa Lỗi Hiển thị Emoji Popover & Modal Lên Lịch Bài Đăng

Kế hoạch giải quyết dứt điểm 3 vấn đề người dùng phản hồi kèm ảnh, bảo toàn 100% quy tắc file size < 200 dòng và thiết kế Figma Desktop 3.1:

| Phase | Nội dung | Mục tiêu & Thành phẩm | Trạng thái |
|---|---|---|---|
| **Phase 01** | [Emoji Popover Dynamic Flip & Tip Removal](./phase-01-emoji-popover-dynamic-flip-and-tip-removal.md) | Thêm cơ chế tự động lật xuống dưới khi thiếu không gian trên, xóa bỏ tip dư thừa | Hoàn thành |
| **Phase 02** | [Schedule Modal nz-modal Teleport](./phase-02-schedule-modal-nz-modal-teleport.md) | Chuyển `PostScheduleModalComponent` sang `<nz-modal>` thoát khỏi containing block của backdrop-filter | Hoàn thành |

### Phụ thuộc chính
- Báo cáo phân tích: [brainstormer-261016-1025-composer-emoji-position-schedule-modal-fix.md](../reports/brainstormer-261016-1025-composer-emoji-position-schedule-modal-fix.md).
- Figma Nodes: `#4496:33933` (Modal Shell & Banner), `#4537:42280` (Month Calendar), `#4537:42815` (Time Picker).
- Container cha: `emergency-main-container` (`backdrop-filter: blur(6px)`).
