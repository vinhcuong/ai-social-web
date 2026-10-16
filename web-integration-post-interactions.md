# Hướng Dẫn Tích Hợp Web: Bộ API Tương Tác Chi Tiết (Hearts & Shares)

Tài liệu này cung cấp đặc tả kỹ thuật, kiểu dữ liệu TypeScript, các hàm gọi API (Axios/TanStack Query) và mẫu giao diện Component (Modal Danh sách người thả tim & chia sẻ) dành cho đội ngũ phát triển Web Frontend (`ai-social-web` và `web-admin`).

---

## 1. Tổng Quan Các API Mới

Backend cung cấp 3 endpoint RESTful trong nhóm tương tác bài viết (`/api/v1/posts`):

| Method | Endpoint | Quyền hạn | Mô tả |
|---|---|---|---|
| `GET` | `/api/v1/posts/:id/hearts` | `EMPLOYEE`, `TENANT_ADMIN` | Lấy danh sách nhân sự đã thả tim bài viết kèm phân trang |
| `GET` | `/api/v1/posts/:id/shares` | `EMPLOYEE`, `TENANT_ADMIN` | Lấy danh sách nhân sự đã chia sẻ bài viết (kèm số lượt chia sẻ `shareCount`) |
| `POST` | `/api/v1/posts/:id/share` | `EMPLOYEE` | Ghi nhận sự kiện chia sẻ (sao chép liên kết hoặc chia sẻ hệ thống) |

> [!NOTE]
> Ngoài 3 API trên, trường `shareCount` (`number`) đã được bổ sung vào DTO của bài viết trên Feed (`COMMON_POST_PROJECTION`) và API chi tiết bài viết `GET /api/v1/posts/:id`. Web có thể hiển thị số lượng chia sẻ trực tiếp trên thẻ bài viết cạnh `heartCount` và `readCount`.

---

## 2. Đặc Tả Chi Tiết API Contracts

### 2.1. Lấy danh sách người thả tim: `GET /api/v1/posts/:id/hearts`

- **Endpoint:** `GET /api/v1/posts/:id/hearts`
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `page` *(tùy chọn, number)*: Trang hiện tại (mặc định: `1`).
  - `limit` *(tùy chọn, number)*: Số lượng bản ghi trên một trang (mặc định: `20`, tối đa: `100`).
  - `before` *(tùy chọn, ISO string)*: Mốc thời gian cursor để phân trang vô hạn (ví dụ: `2026-10-16T10:00:00.000Z`).
- **Phản hồi thành công (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "employeeId": "0192f0c8-7c1a-7000-8000-000000000002",
        "employeeCode": "VNPT033136",
        "fullName": "Đồng Anh Vĩnh Cường",
        "title": "Chuyên viên Kỹ thuật",
        "unitName": "Trung tâm Sản phẩm & Trải nghiệm số",
        "unitCode": "TTSPTX",
        "gcnUserId": "gcn_user_8899",
        "avatarUrl": null,
        "interactedAt": "2026-10-16T11:14:24.000Z"
      }
    ],
    "total": 42,
    "page": 1,
    "limit": 20,
    "hasMore": true
  }
}
```

---

### 2.2. Lấy danh sách người chia sẻ: `GET /api/v1/posts/:id/shares`

- **Endpoint:** `GET /api/v1/posts/:id/shares`
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:** Tương tự như API hearts (`page`, `limit`, `before`).
- **Phản hồi thành công (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "employeeId": "0192f0c8-7c1a-7000-8000-000000000002",
        "employeeCode": "VNPT033136",
        "fullName": "Đồng Anh Vĩnh Cường",
        "title": "Chuyên viên Kỹ thuật",
        "unitName": "Trung tâm Sản phẩm & Trải nghiệm số",
        "unitCode": "TTSPTX",
        "gcnUserId": "gcn_user_8899",
        "avatarUrl": null,
        "interactedAt": "2026-10-16T11:14:25.000Z",
        "shareCount": 2
      }
    ],
    "total": 15,
    "page": 1,
    "limit": 20,
    "hasMore": false
  }
}
```

> [!TIP]
> Mỗi bản ghi trong `items` đại diện cho **1 nhân sự duy nhất**. Trường `shareCount` cho biết nhân sự đó đã chia sẻ bài viết bao nhiêu lần. Trường `total` ở cấp ngoài cùng phản ánh tổng số lượt chia sẻ của cả bài viết (`posts.share_count`).

---

### 2.3. Ghi nhận hành động chia sẻ: `POST /api/v1/posts/:id/share`

- **Endpoint:** `POST /api/v1/posts/:id/share`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body (Tùy chọn):**
```json
{
  "source": "web",
  "target": "copy_link"
}
```
*(Trong đó `source`: `"web"` hoặc `"app"`; `target`: chuỗi mô tả nơi chia sẻ, ví dụ: `"copy_link"`, `"zalo"`, `"teams"`, `"facebook"`).*

- **Phản hồi thành công (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "success": true,
    "shareCount": 16,
    "myShareCount": 3
  }
}
```

---

## 3. TypeScript Interfaces

Định nghĩa kiểu dữ liệu dùng chung trong dự án Web (`src/types/post-interactions.ts`):

```typescript
export interface PostInteractionUserItem {
  employeeId: string;
  employeeCode: string;
  fullName: string;
  title?: string | null;
  unitName: string;
  unitCode: string;
  gcnUserId?: string | null;
  avatarUrl?: string | null;
  interactedAt: string; // ISO 8601 string
  shareCount?: number;  // Chỉ xuất hiện trong danh sách chia sẻ
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

---

## 4. Tầng Gọi API (API Services)

Khai báo các hàm dịch vụ trong `src/services/post-interaction.service.ts`:

```typescript
import { apiClient } from '@/shared/api/client';
import {
  PostInteractionListResponse,
  QueryInteractionListParams,
  TrackSharePayload,
  TrackShareResponse,
} from '@/types/post-interactions';

export const postInteractionService = {
  /**
   * Lấy danh sách nhân sự đã thả tim bài viết
   */
  getPostHearts: async (
    postId: string,
    params?: QueryInteractionListParams,
  ): Promise<PostInteractionListResponse> => {
    const res = await apiClient.get<PostInteractionListResponse>(
      `/posts/${postId}/hearts`,
      { params },
    );
    return res.data;
  },

  /**
   * Lấy danh sách nhân sự đã chia sẻ bài viết
   */
  getPostShares: async (
    postId: string,
    params?: QueryInteractionListParams,
  ): Promise<PostInteractionListResponse> => {
    const res = await apiClient.get<PostInteractionListResponse>(
      `/posts/${postId}/shares`,
      { params },
    );
    return res.data;
  },

  /**
   * Ghi nhận lượt chia sẻ bài viết
   */
  trackShare: async (
    postId: string,
    payload: TrackSharePayload = { source: 'web', target: 'copy_link' },
  ): Promise<TrackShareResponse> => {
    const res = await apiClient.post<TrackShareResponse>(
      `/posts/${postId}/share`,
      payload,
    );
    return res.data;
  },
};
```

---

## 5. React Hooks Dùng Với `@tanstack/react-query`

Tạo file `src/hooks/usePostInteractions.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postInteractionService } from '@/services/post-interaction.service';
import { QueryInteractionListParams, TrackSharePayload } from '@/types/post-interactions';

/**
 * Hook truy vấn danh sách người thả tim
 */
export function usePostHearts(postId?: string, params?: QueryInteractionListParams, enabled = true) {
  return useQuery({
    queryKey: ['post-hearts', postId, params],
    queryFn: () => postInteractionService.getPostHearts(postId!, params),
    enabled: !!postId && enabled,
    staleTime: 30000, // 30s
  });
}

/**
 * Hook truy vấn danh sách người chia sẻ
 */
export function usePostShares(postId?: string, params?: QueryInteractionListParams, enabled = true) {
  return useQuery({
    queryKey: ['post-shares', postId, params],
    queryFn: () => postInteractionService.getPostShares(postId!, params),
    enabled: !!postId && enabled,
    staleTime: 30000,
  });
}

/**
 * Hook đột biến khi thực hiện chia sẻ bài viết
 */
export function useTrackPostShare(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload?: TrackSharePayload) =>
      postInteractionService.trackShare(postId, payload),
    onSuccess: (data) => {
      // Invalidate danh sách chia sẻ và chi tiết bài viết để cập nhật số lượt tức thì
      queryClient.invalidateQueries({ queryKey: ['post-shares', postId] });
      queryClient.invalidateQueries({ queryKey: ['post-detail', postId] });
      queryClient.invalidateQueries({ queryKey: ['channel-feed'] });
    },
  });
}
```

---

## 6. Mẫu Giao Diện Component: Modal Tương Tác Chi Tiết

Dưới đây là component mẫu hoàn chỉnh `PostInteractionsModal.tsx` hỗ trợ chuyển tab giữa **Thả tim** và **Chia sẻ**, hiển thị avatar/chữ cái đầu và thời gian tương tác:

```tsx
import React, { useState } from 'react';
import { Heart, Share2, X, Clock, Building2 } from 'lucide-react';
import { usePostHearts, usePostShares } from '@/hooks/usePostInteractions';
import { PostInteractionUserItem } from '@/types/post-interactions';

interface PostInteractionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  initialTab?: 'hearts' | 'shares';
  heartCount?: number;
  shareCount?: number;
}

export const PostInteractionsModal: React.FC<PostInteractionsModalProps> = ({
  isOpen,
  onClose,
  postId,
  initialTab = 'hearts',
  heartCount = 0,
  shareCount = 0,
}) => {
  const [activeTab, setActiveTab] = useState<'hearts' | 'shares'>(initialTab);

  const { data: heartsData, isLoading: isLoadingHearts } = usePostHearts(
    postId,
    { limit: 50 },
    isOpen && activeTab === 'hearts',
  );

  const { data: sharesData, isLoading: isLoadingShares } = usePostShares(
    postId,
    { limit: 50 },
    isOpen && activeTab === 'shares',
  );

  if (!isOpen) return null;

  const currentTotal = activeTab === 'hearts' 
    ? (heartsData?.total ?? heartCount) 
    : (sharesData?.total ?? shareCount);

  const items = activeTab === 'hearts' ? (heartsData?.items || []) : (sharesData?.items || []);
  const isLoading = activeTab === 'hearts' ? isLoadingHearts : isLoadingShares;

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
      });
    } catch {
      return '';
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    return parts[parts.length - 1][0].toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Tabs */}
        <div className="flex items-center justify-between border-b border-slate-100 px-4 pt-4 pb-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('hearts')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'hearts'
                  ? 'bg-rose-50 text-rose-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${activeTab === 'hearts' ? 'fill-rose-500 text-rose-500' : ''}`} />
              Thả tim ({activeTab === 'hearts' ? currentTotal : heartCount})
            </button>

            <button
              onClick={() => setActiveTab('shares')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'shares'
                  ? 'bg-blue-50 text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Share2 className="w-4 h-4 text-blue-500" />
              Chia sẻ ({activeTab === 'shares' ? currentTotal : shareCount})
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-50">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3">
              <div className="w-8 h-8 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-sm">Đang tải danh sách...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
              {activeTab === 'hearts' ? (
                <>
                  <Heart className="w-12 h-12 text-slate-200" />
                  <p className="text-sm font-medium">Chưa có ai thả tim bài viết này</p>
                </>
              ) : (
                <>
                  <Share2 className="w-12 h-12 text-slate-200" />
                  <p className="text-sm font-medium">Chưa có ai chia sẻ bài viết này</p>
                </>
              )}
            </div>
          ) : (
            items.map((user: PostInteractionUserItem) => (
              <div key={user.employeeId} className="flex items-center justify-between py-3 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-semibold text-sm flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                    ) : (
                      getInitials(user.fullName)
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-semibold text-slate-800 truncate">{user.fullName}</h4>
                      <span className="text-xs text-slate-400 font-normal">({user.employeeCode})</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 truncate">
                      <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">{user.unitName}</span>
                      {user.title && <span className="text-slate-400">• {user.title}</span>}
                    </div>
                  </div>
                </div>

                {/* Meta badge */}
                <div className="text-right shrink-0">
                  {activeTab === 'shares' && (user.shareCount || 0) > 1 && (
                    <span className="inline-block bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full font-semibold mb-1">
                      {user.shareCount} lượt
                    </span>
                  )}
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(user.interactedAt)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
```

---

## 7. Mẫu Nút Chia Sẻ & Tự Động Bắn Sự Kiện Track Share

Khi người dùng bấm vào nút "Chia sẻ" trên thẻ bài viết:

```tsx
import React, { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';
import { useTrackPostShare } from '@/hooks/usePostInteractions';

interface PostShareButtonProps {
  postId: string;
  shareUrl: string;
  shareCount: number;
  onOpenList: () => void;
}

export const PostShareButton: React.FC<PostShareButtonProps> = ({
  postId,
  shareUrl,
  shareCount,
  onOpenList,
}) => {
  const [copied, setCopied] = useState(false);
  const trackShareMutation = useTrackPostShare(postId);

  const handleShare = async () => {
    try {
      // 1. Sao chép link vào clipboard
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      // 2. Bắn API ghi nhận lượt chia sẻ
      trackShareMutation.mutate({ source: 'web', target: 'copy_link' });
    } catch (err) {
      console.error('Sao chép liên kết thất bại:', err);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handleShare}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-500" />
            <span className="text-emerald-600">Đã chép link!</span>
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4 text-slate-500" />
            <span>Chia sẻ</span>
          </>
        )}
      </button>

      {shareCount > 0 && (
        <button
          onClick={onOpenList}
          className="text-xs text-slate-400 hover:text-slate-600 hover:underline px-1"
          title="Xem danh sách người chia sẻ"
        >
          {shareCount}
        </button>
      )}
    </div>
  );
};
```

---

## 8. Những Lưu Ý Nghiệp Vụ Quan Trọng

1. **Phân quyền và bảo mật xem bài viết:**
   - Các API `GET /posts/:id/hearts` và `GET /posts/:id/shares` tự động kiểm tra quyền xem bài viết (`p.audience_all = true` hoặc nhân viên nằm trong danh sách người nhận `post_recipients`).
   - Nếu bài viết ở trạng thái nháp (`draft`) hoặc người gọi không có quyền xem, Backend sẽ trả về `403 Forbidden` hoặc `404 Not Found`.
2. **Cơ chế ghi nhận chia sẻ:**
   - Hành động chia sẻ là sự kiện một chiều, không thể hủy bỏ (không có API "unshare").
   - Nếu 1 nhân viên bấm chia sẻ nhiều lần, Backend sẽ tự động cộng dồn `posts.share_count` và cập nhật trường `count` của nhân viên đó.
3. **Hiển thị Avatar Fallback:**
   - Nếu `user.avatarUrl` là `null`, Frontend nên dùng hàm `getInitials(user.fullName)` lấy chữ cái đầu của tên hoặc map qua CDN GoConnect theo `gcnUserId`.
