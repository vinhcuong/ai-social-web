# Phase 02: Đồng bộ Dữ liệu vào PostStatsModalComponent & Tự động Track Share

## Context Links
- [Báo cáo Brainstorm](file:///Users/vinhcuong/Dev/ai-social-web/plans/reports/brainstormer-261016-1121-post-interactions-hearts-shares-integration.md)
- [post-stats-modal.component.ts](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/components/post-stats-modal/post-stats-modal.component.ts)
- [post-stats-modal.component.html](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/components/post-stats-modal/post-stats-modal.component.html)
- [emergency-channel-view.component.ts](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/views/channels/emergency-channel-view/emergency-channel-view.component.ts)
- [ai-social-share-modal.component.ts](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/components/share-modal/ai-social-share-modal.component.ts)

---

## Overview
- **Mục tiêu**: Kết nối dữ liệu API thực tế từ backend vào 4 tab của `PostStatsModalComponent`, hiển thị đúng số lượng đếm, danh sách người thả tim, người chia sẻ, và tự động gọi `trackShare` khi chia sẻ hoặc sao chép liên kết.
- **Trạng thái**: Completed.
- **Ưu tiên**: P1.
- **Ước lượng**: 40 phút.

---

## Chi tiết Thay đổi Kỹ thuật

### 1. [MODIFY] `PostStatsModalComponent` (`post-stats-modal.component.ts`)
- Thêm signal lưu trữ danh sách nhân sự thả tim `heartUsers = signal<PostInteractionUserItem[]>([])` và danh sách chia sẻ `shareUsers = signal<PostInteractionUserItem[]>([])`.
- Trong `loadStats()`:
  - Gọi song song:
    ```typescript
    const [unitRes, usersRes, heartsRes, sharesRes] = await Promise.all([
      this.api.getPostDepartmentBreakdown(p.id),
      this.api.getPostRecipients(p.id),
      this.api.getPostHearts(p.id, { limit: 50 }),
      this.api.getPostShares(p.id, { limit: 50 }),
    ]);
    ```
  - Cập nhật số lượng đếm thật: `heartCount` từ `heartsRes.total`, `shareCount` từ `sharesRes.total`.
- Trong `filteredUsers()`:
  - Nếu `activeTab === 'read'`: lọc nhân sự `status === 'read'` từ `recipientUsers`.
  - Nếu `activeTab === 'unread'`: lọc nhân sự `status === 'unread'` từ `recipientUsers`.
  - Nếu `activeTab === 'heart'`: trả về danh sách từ `heartUsers` (chuẩn hóa view-model).
  - Nếu `activeTab === 'share'`: trả về danh sách từ `shareUsers` (chuẩn hóa view-model, kèm `shareCount`).
  - Áp dụng bộ lọc phòng ban (`selectedUnitId`) và từ khoá tìm kiếm (`searchTerm`).
- Hàm `formatTime(isoString: string)`: Chuyển đổi timestamp ISO từ API sang định dạng hiển thị tiếng Việt (`HH:mm`, `Hôm qua lúc HH:mm`, `DD/MM/YYYY lúc HH:mm`).
- Đảm bảo `post-stats-modal.component.ts` duy trì < 200 dòng (dự kiến ~180 dòng).

### 2. [MODIFY] `PostStatsModalComponent` Template (`post-stats-modal.component.html`)
- Hiển thị badge số lượt chia sẻ `{{ usr.shareCount }} lượt` khi ở tab `Đã chia sẻ`.
- Hiển thị icon tương ứng với từng tab (tim đỏ cho tab tim, icon share/double-check cho tab share/read).
- Đảm bảo file template duy trì < 150 dòng.

### 3. [MODIFY] Tự động kích hoạt Track Share
1. **Tại `emergency-channel-view.component.ts`**:
   - Khi người dùng click nút `Copy link` (`copyPostLink`): Gọi `this.api.trackShare(post.id, { source: 'web', target: 'copy_link' })`.
2. **Tại `ai-social-share-modal.component.ts`**:
   - Khi người dùng click `Sao chép liên kết`: Gọi `this.api.trackShare(this.post().id, { source: 'web', target: 'copy_link' })`.
   - Khi chia sẻ qua `navigator.share` hoặc `window.GoConnectBridge`: Gọi `this.api.trackShare(this.post().id, { source: 'web', target: 'system_share' })`.

---

## Todo List
- [x] Cập nhật `post-stats-modal.component.ts` tích hợp `getPostHearts` và `getPostShares`.
- [x] Cập nhật template `post-stats-modal.component.html` hiển thị chi tiết số lượt chia sẻ.
- [x] Tích hợp `trackShare` vào `emergency-channel-view.component.ts` và `ai-social-share-modal.component.ts`.
- [x] Kiểm tra số dòng của tất cả các file sửa đổi đảm bảo < 200 dòng.
- [x] Chạy `npm run build` để kiểm tra toàn bộ ứng dụng biên dịch thành công.

---

## Success Criteria
1. Tab "Thả tim" và tab "Đã chia sẻ" tải và hiển thị danh sách nhân sự thực tế từ backend.
2. Số lượng đếm trên header tab khớp với `total` của API.
3. Khi sao chép liên kết bài viết, backend ghi nhận lượt chia sẻ thành công và tăng `shareCount`.
4. `npm run build` thành công 100% với 0 warning, 0 error.
