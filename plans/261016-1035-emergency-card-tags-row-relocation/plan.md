---
title: "Plan: Relocate Emergency Post Card Tags & Actions Row Above Footer"
description: "Di chuyển khối emerg-tags-actions-row (Tags, Hashtag phân loại, Đối tượng, Chia sẻ, Copy link) từ đỉnh bài viết xuống ngay phía trên footer Xác nhận đã đọc & Danh sách chi tiết."
status: complete
priority: medium
effort: 30m
branch: main
tags: [frontend, angular22, emergency-channel, post-card, ui-ux, layout]
created: 2026-10-16
---

# Overview Plan: Tái Bố Cục Thẻ Thông Báo Khẩn (Dời Hàng Tags/Hashtags Xuống Phía Trên Footer)

Kế hoạch tái cấu trúc giao diện thẻ bài viết thông báo khẩn (`app-emergency-channel-view`), đưa hàng tags và nút hành động xuống ngay phía trên footer xác nhận đã đọc theo đúng yêu cầu người dùng:

| Phase | Nội dung | Mục tiêu & Thành phẩm | Trạng thái |
|---|---|---|---|
| **Phase 01** | [Relocate Tags Row](./phase-01-relocate-emergency-tags-actions-row.md) | Dời `emerg-tags-actions-row` xuống trên `emerg-note-footer`, tinh chỉnh khoảng cách, xác thực build 0 lỗi | Hoàn thành |

### Phụ thuộc chính
- Báo cáo phân tích: [brainstormer-261016-1035-emergency-card-tags-row-relocation.md](../reports/brainstormer-261016-1035-emergency-card-tags-row-relocation.md).
- File template: [emergency-channel-view.component.html](../../src/app/features/ai-social/views/channels/emergency-channel-view/emergency-channel-view.component.html).
- File stylesheet: [emergency-channel-view.component.scss](../../src/app/features/ai-social/views/channels/emergency-channel-view/emergency-channel-view.component.scss).
