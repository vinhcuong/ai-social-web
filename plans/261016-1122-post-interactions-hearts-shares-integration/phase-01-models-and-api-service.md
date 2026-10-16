# Phase 01: Bổ sung TypeScript DTO & Tầng gọi API trong AiSocialApiService

## Context Links
- [Báo cáo Brainstorm](file:///Users/vinhcuong/Dev/ai-social-web/plans/reports/brainstormer-261016-1121-post-interactions-hearts-shares-integration.md)
- [Hướng dẫn tích hợp Web](file:///Users/vinhcuong/Dev/ai-social-web/web-integration-post-interactions.md)
- [ai-social-extended.models.ts](file:///Users/vinhcuong/Dev/ai-social-web/src/app/core/models/ai-social-extended.models.ts)
- [ai-social-api.service.ts](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/services/ai-social-api.service.ts)

---

## Overview
- **Mục tiêu**: Bổ sung đầy đủ các định nghĩa interface tương tác chi tiết (`PostInteractionUserItem`, `PostInteractionListResponse`, `TrackSharePayload`, `TrackShareResponse`) và hiện thực 3 hàm API trong `AiSocialApiService`.
- **Trạng thái**: Completed.
- **Ưu tiên**: P1.
- **Ước lượng**: 20 phút.

---

## Chi tiết Thay đổi Kỹ thuật

### 1. [MODIFY] `src/app/core/models/ai-social-extended.models.ts`
Bổ sung các interface chuẩn theo đặc tả:
```typescript
export interface PostInteractionUserItem {
  employeeId: string;
  employeeCode: string;
  fullName: string;
  title?: string | null;
  unitName: string;
  unitCode?: string | null;
  gcnUserId?: string | null;
  avatarUrl?: string | null;
  interactedAt: string;
  shareCount?: number;
}

export interface PostInteractionListResponse {
  items: PostInteractionUserItem[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface QueryInteractionListParams {
  page?: number;
  limit?: number;
  before?: string;
}

export interface TrackSharePayload {
  source?: 'web' | 'app';
  target?: 'copy_link' | 'system_share' | string;
}

export interface TrackShareResponse {
  success: boolean;
  shareCount: number;
  myShareCount: number;
}
```

### 2. [MODIFY] `src/app/features/ai-social/services/ai-social-api.service.ts`
Bổ sung 3 phương thức:
1. `getPostHearts(postId: string, params?: QueryInteractionListParams): Promise<PostInteractionListResponse>`
   - `GET /posts/${postId}/hearts`
   - Fallback an toàn nếu lỗi mạng.
2. `getPostShares(postId: string, params?: QueryInteractionListParams): Promise<PostInteractionListResponse>`
   - `GET /posts/${postId}/shares`
   - Fallback an toàn nếu lỗi mạng.
3. `trackShare(postId: string, payload?: TrackSharePayload): Promise<TrackShareResponse>`
   - `POST /posts/${postId}/share`
   - Ghi nhận lượt chia sẻ và trả về `shareCount` mới nhất.

---

## Todo List
- [x] Bổ sung các interface vào `ai-social-extended.models.ts`.
- [x] Khai báo 3 phương thức API vào `ai-social-api.service.ts`.
- [x] Chạy `npm run build` để xác thực cú pháp và kiểu dữ liệu.

---

## Success Criteria
- Mã nguồn biên dịch không có lỗi TypeScript (0 errors).
- 3 phương thức sẵn sàng cho `PostStatsModalComponent` và các thành phần chia sẻ sử dụng.
