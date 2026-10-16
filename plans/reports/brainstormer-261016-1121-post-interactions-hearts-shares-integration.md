---
title: "Brainstorm: Tích hợp Bộ API Tương tác Chi tiết (Hearts, Shares & Track Share)"
description: "Phân tích kiến trúc tích hợp 3 endpoint mới (/posts/:id/hearts, /posts/:id/shares, /posts/:id/share) vào ai-social-web, đồng bộ dữ liệu thực tế vào PostStatsModal và ghi nhận lượt chia sẻ."
status: decided
topic: "post-interactions-hearts-shares-integration"
chosen_option: "Option 1: Tích hợp Thống nhất vào AiSocialApiService & PostStatsModalComponent (Đồng bộ Figma 3.1)"
date: 2026-10-16
tags: [api-integration, post-interactions, hearts, shares, track-share, post-stats-modal, ai-social-web]
---

# Brainstorm Report: Tích hợp Bộ API Tương tác Chi tiết (Hearts & Shares)

## Executive Summary
Backend `ai-social-backend` đã chính thức triển khai 3 endpoint mới: `GET /api/v1/posts/:id/hearts`, `GET /api/v1/posts/:id/shares` và `POST /api/v1/posts/:id/share`. Báo cáo này phân tích kiến trúc tích hợp toàn diện bộ API này vào `ai-social-web`, giải quyết triệt để vấn đề dữ liệu trống trên các tab "Thả tim" và "Đã chia sẻ" của `PostStatsModalComponent`, đồng thời tự động kích hoạt tracking khi người dùng sao chép link hoặc chia sẻ bài viết.

---

## 1. Context & Objectives

### 1.1. Hiện trạng API Backend (Đã kích hoạt)
Qua kiểm tra thực tế router backend trên port 3100:
- `GET /api/v1/posts/:id/hearts`: Đã sẵn sàng (HTTP 401 với Bearer Guard), trả về danh sách nhân sự thả tim kèm `interactedAt`.
- `GET /api/v1/posts/:id/shares`: Đã sẵn sàng (HTTP 401 với Bearer Guard), trả về danh sách nhân sự chia sẻ kèm `interactedAt` và `shareCount` của từng nhân sự.
- `POST /api/v1/posts/:id/share`: Đã sẵn sàng (HTTP 401 với Bearer Guard), ghi nhận lượt chia sẻ và trả về `shareCount` cập nhật.

### 1.2. Mục tiêu Tích hợp
1. **Mô hình Dữ liệu (DTO/Interfaces)**: Bổ sung các interface chuẩn theo [web-integration-post-interactions.md](file:///Users/vinhcuong/Dev/ai-social-web/web-integration-post-interactions.md) vào `ai-social-extended.models.ts`.
2. **Tầng Service (`AiSocialApiService`)**: Khai báo 3 phương thức `getPostHearts`, `getPostShares`, `trackShare` với cơ chế unwrap và fallback an toàn.
3. **Modal Thống kê & Chi tiết (`PostStatsModalComponent`)**:
   - Khi chọn tab `Thả tim` (`heart`): Hiển thị danh sách nhân sự thực tế từ `getPostHearts()`.
   - Khi chọn tab `Đã chia sẻ` (`share`): Hiển thị danh sách nhân sự thực tế từ `getPostShares()` kèm badge số lượt chia sẻ.
   - Khi chọn tab `Đã đọc` (`read`) hoặc `Chưa đọc` (`unread`): Hiển thị danh sách từ `getPostRecipients()`.
   - Cập nhật số lượng đếm trên tab header từ kết quả `total` thực tế của API.
4. **Tracking Tự động (Auto Track Share)**: Gọi `api.trackShare(post.id)` khi người dùng:
   - Bấm nút `Copy link` trên thẻ bài viết hoặc modal chia sẻ.
   - Thực hiện chia sẻ qua hệ điều hành (`navigator.share`) hoặc chia sẻ WebView GoConnect.
5. **Quy chuẩn Mã nguồn**: Duy trì các file sửa đổi nghiêm ngặt dưới 200 dòng (< 200 LOC) theo `GEMINI.md`.

---

## 2. Các Phương án Triển khai (Evaluated Options)

### Option 1: Tích hợp Thống nhất vào `PostStatsModalComponent` & `AiSocialApiService` (Khuyến nghị)
- **Ý tưởng**:
  - Không tạo modal rời rạc để tránh chia cắt trải nghiệm người dùng; tích hợp trực tiếp 3 API vào `PostStatsModalComponent` hiện có vốn đã được xây dựng theo đúng Figma 3.1 Node `#4361:14403`.
  - Trong `PostStatsModalComponent`, tổ chức nạp dữ liệu theo cơ chế **Dynamic Tab Hydration**:
    - Khi modal mở ra, tải song song `recipients`, `hearts` và `shares` (hoặc nạp theo tab đang chọn).
    - Chuẩn hóa danh sách hiển thị về chung cấu trúc view-item (`fullName`, `jobTitle`, `unitName`, `avatarUrl`, `timeText`, `isHearted`, `isShared`, `shareCount`).
  - Gắn lời gọi `api.trackShare(post.id)` dạng `fire-and-forget` trong các hàm chia sẻ.
- **Ưu điểm**:
  - Khớp 100% thiết kế Figma Desktop 3.1: 4 tab nằm gọn trong 1 modal duy nhất.
  - Người dùng xem được đầy đủ bức tranh tương tác của bài viết: ai đọc, ai tim, ai share, ai chưa đọc.
  - Dữ liệu hoàn toàn là dữ liệu thật từ backend, không còn phụ thuộc vào seed mockup.
  - Giữ được giới hạn file < 200 dòng bằng cách ánh xạ view model tinh gọn.
- **Nhược điểm**: Cần xử lý mapping thời gian `interactedAt` sang chuỗi hiển thị thân thiện (`vi-VN`).

### Option 2: Tạo Modal Tách Rời `PostInteractionsModal` (Theo mẫu React trong tài liệu)
- **Ý tưởng**: Tạo riêng một modal nhỏ chỉ có 2 tab Tim & Share như component React mẫu trong `web-integration-post-interactions.md`, tách biệt khỏi modal xem chi tiết người nhận.
- **Ưu điểm**: Code độc lập, không đụng chạm vào `PostStatsModalComponent`.
- **Nhược điểm & Rủi ro**:
  - **Phá vỡ thiết kế Figma**: Figma 3.1 quy định một modal duy nhất chứa cả 4 tab (`Đã đọc`, `Thả tim`, `Đã chia sẻ`, `Chưa đọc`).
  - Người dùng quản trị phải mở 2 modal khác nhau để xem tương tác cùng 1 bài viết $\rightarrow$ Trải nghiệm rời rạc, khó chịu.

---

## 3. Ma trận Đánh giá Trade-off

| Tiêu chí | Option 1: Tích hợp Thống nhất (Khuyến nghị) | Option 2: Modal Rời rạc |
|---|---|---|
| **Độ khớp Figma 3.1 Node #4361:14403** | **100% (Hoàn hảo)** | 40% (Lệch thiết kế tổng thể) |
| **Tính nhất quán trải nghiệm (UX)** | **Xuất sắc**: 1 điểm đến cho mọi tương tác | Trung bình: Phải mở 2 modal khác nhau |
| **Đồng bộ Dữ liệu Thực tế** | **Cao**: Đọc, Tim, Share đều kết nối backend | Cao |
| **Khả năng Bảo trì & < 200 LOC** | **Cao**: Tận dụng layout có sẵn, thêm mapping | Thấp: Tăng thêm component dư thừa |
| **Độ phức tạp Thực thi** | Thấp - Trung bình (~45 phút) | Trung bình |

---

## 4. Quyết định Kỹ thuật (Final Decision)

* **Phương án lựa chọn**: **Option 1 — Tích hợp Thống nhất vào `AiSocialApiService` & `PostStatsModalComponent`**.
* **Các bước triển khai cụ thể**:
  1. **Bước 1**: Bổ sung interface `PostInteractionUserItem`, `PostInteractionListResponse`, `TrackSharePayload`, `TrackShareResponse` vào [ai-social-extended.models.ts](file:///Users/vinhcuong/Dev/ai-social-web/src/app/core/models/ai-social-extended.models.ts).
  2. **Bước 2**: Bổ sung 3 phương thức `getPostHearts`, `getPostShares`, `trackShare` vào [ai-social-api.service.ts](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/services/ai-social-api.service.ts).
  3. **Bước 3**: Cập nhật logic `loadStats()` trong [post-stats-modal.component.ts](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/components/post-stats-modal/post-stats-modal.component.ts):
     - Gọi `getPostHearts(post.id)` để lấy danh sách người thả tim thật và gán cho `heartUsers`, cập nhật `heartCount`.
     - Gọi `getPostShares(post.id)` để lấy danh sách người chia sẻ thật và gán cho `shareUsers`, cập nhật `shareCount`.
     - Chuyển tab mượt mà giữa Đã đọc, Thả tim, Chia sẻ, Chưa đọc với dữ liệu API thực tế.
  4. **Bước 4**: Tích hợp gọi `api.trackShare(post.id)` khi thực hiện copy link hoặc chia sẻ tại [emergency-channel-view.component.ts](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/views/channels/emergency-channel-view/emergency-channel-view.component.ts) và [ai-social-share-modal.component.ts](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/components/share-modal/ai-social-share-modal.component.ts).
  5. **Bước 5**: Kiểm tra biên dịch `npm run build` và kiểm thử chức năng.

---

## 5. Các bước tiếp theo & Handoff

1. [ ] Trình báo cáo brainstorm cho người dùng duyệt.
2. [ ] Kích hoạt `/plan` để lập kế hoạch chi tiết hoặc `/cook` để tiến hành lập trình tích hợp API ngay lập tức.
