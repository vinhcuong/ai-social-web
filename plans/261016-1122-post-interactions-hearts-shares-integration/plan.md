---
title: "Tích hợp Bộ API Tương tác Chi tiết (Hearts, Shares & Track Share)"
description: "Tích hợp 3 API mới (/posts/:id/hearts, /posts/:id/shares, /posts/:id/share) vào ai-social-web, đồng bộ dữ liệu thực tế vào PostStatsModalComponent và tự động tracking lượt chia sẻ."
status: completed
priority: P1
effort: 1h
branch: main
tags: [frontend, api-integration, post-interactions, hearts, shares, tracking]
created: 2026-10-16
---

# Kế hoạch Tổng quan: Tích hợp Bộ API Tương tác Chi tiết

## Mục tiêu
- Định nghĩa kiểu dữ liệu chuẩn theo `web-integration-post-interactions.md`.
- Bổ sung 3 phương thức `getPostHearts`, `getPostShares`, `trackShare` vào `AiSocialApiService`.
- Kết nối dữ liệu thực tế từ backend vào 4 tab của `PostStatsModalComponent` (`read`, `heart`, `share`, `unread`), có cơ chế fallback linh hoạt nếu danh sách rỗng.
- Tự động gọi `trackShare(postId)` khi người dùng copy link hoặc chia sẻ bài viết.
- Đảm bảo tất cả các file mã nguồn tuân thủ nghiêm ngặt giới hạn dưới 200 dòng (< 200 LOC).

## Các giai đoạn triển khai

| Giai đoạn | Nội dung | Trạng thái | Ước lượng | Chi tiết |
|---|---|---|---|---|
| **Phase 01** | Bổ sung TypeScript DTO & Tầng gọi API trong `AiSocialApiService` | Completed | 20m | [phase-01-models-and-api-service.md](./phase-01-models-and-api-service.md) |
| **Phase 02** | Đồng bộ Dữ liệu vào `PostStatsModalComponent` & Tự động Track Share | Completed | 40m | [phase-02-modal-and-tracking.md](./phase-02-modal-and-tracking.md) |

## Tài liệu tham chiếu
- [Báo cáo Brainstorm](file:///Users/vinhcuong/Dev/ai-social-web/plans/reports/brainstormer-261016-1121-post-interactions-hearts-shares-integration.md)
- [Báo cáo Triển khai Cook](file:///Users/vinhcuong/Dev/ai-social-web/plans/reports/cook-261016-1128-post-interactions-hearts-shares-integration.md)
- [Báo cáo Kiểm thử Tester](file:///Users/vinhcuong/Dev/ai-social-web/plans/reports/tester-261016-1129-post-interactions-hearts-shares-integration.md)
- [Hướng dẫn tích hợp Web](file:///Users/vinhcuong/Dev/ai-social-web/web-integration-post-interactions.md)
