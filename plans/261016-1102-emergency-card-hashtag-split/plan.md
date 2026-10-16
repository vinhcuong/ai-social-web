---
title: "Kế hoạch: Tách Hashtag Phân Loại Xuống Dưới & Giữ Cụm Trạng Thái Ở Đỉnh Thẻ"
description: "Khôi phục hàng trạng thái, đối tượng và nút tác vụ ở đỉnh thẻ cạnh thumbnail (Hình 1 Design), chỉ đưa duy nhất hashtag phân loại (# Category) xuống vị trí phía trên footer xác nhận đọc."
status: in-progress
priority: high
effort: 30m
branch: main
tags: [emergency-channel, figma-alignment, hashtag-split, ui-card]
created: 2026-10-16
---

# Kế hoạch Tổng quan: Tách Hashtag Thẻ Thông Báo Khẩn

## Mục tiêu
- Đưa cụm `emerg-tags-actions-row` (gồm badge `Đang phát` / `Đã kết thúc`, badge `Toàn công ty`, nút `Chia sẻ` và `Copy link`) trở lại phần đầu thẻ `emerg-head-content` cạnh thumbnail 110x110 (khớp 100% Hình 1 Design).
- Đưa **duy nhất phần hashtag phân loại** (`# {{ getCategoryLabel(post.categoryCode) }}`) xuống vị trí phía dưới thân bài, ngay trên footer `emerg-note-footer`.
- Đảm bảo toàn bộ file HTML và SCSS duy trì nghiêm ngặt dưới 200 dòng (< 200 LOC).

## Các giai đoạn thực hiện

| Giai đoạn | Nội dung | Trạng thái | Chi tiết |
|---|---|---|---|
| **Phase 01** | Tách cấu trúc Template HTML & Bổ sung style SCSS | **Hoàn thành** | [phase-01-hashtag-split.md](./phase-01-hashtag-split.md) |

## Tài liệu tham chiếu
- [Báo cáo Brainstorm](file:///Users/vinhcuong/Dev/ai-social-web/plans/reports/brainstormer-261016-1040-emergency-card-hashtag-split-refinement.md)
