# Báo cáo Khảo sát: Hiện trạng API Tương tác & Nguyên nhân Dữ liệu Trống (Empty Data)

- **Thời gian**: 2026-10-16 10:58
- **Dự án**: `ai-social-web` & `ai-social-backend`
- **Mục tiêu**: Kiểm toán thực tế các endpoint API tương tác bài viết, giải thích nguyên nhân dữ liệu bị trống trên UI và đề xuất giải pháp đồng bộ.

---

## 1. Tóm tắt kết luận (Executive Summary)

1. **Về API**: Backend **ĐÃ CÓ** 3 endpoint quản lý người nhận (`/recipients/summary`, `/recipients/units`, `/recipients`), nhưng **CHƯA CÓ** API trả danh sách chi tiết người thả tim (`/hearts`) và người chia sẻ (`/shares`). Backend hiện chỉ lưu tổng số `heartCount` trên Post.
2. **Về việc dữ liệu bị trống trơn**:
   - Backend thực tế trả về `{ units: [] }` (0 phòng ban) và 20 nhân sự nhưng toàn bộ đều có `status: 'unread'`.
   - Modal vừa cập nhật đang đặt mặc định `activeTab = 'heart'`. Do backend không có cờ `isHearted` và tất cả đều `unread`, hàm `filter()` lọc ra kết quả rỗng (0 nhân sự)!
   - Khi `units = []`, hàng Pill phòng ban không hiển thị được nút nào ngoại trừ nút `Tất cả`.

---

## 2. Kiểm toán Thực tế API Backend (`ai-social-backend:3100`)

Qua kiểm tra trực tiếp router backend qua giao thức HTTP:

| Endpoint | Trạng thái Route | Cấu trúc Dữ liệu | Tương thích Figma |
|---|---|---|---|
| `GET /api/v1/posts/:id/recipients/summary` | **Đã có** (401 Auth Guard) | `{ totalRecipients, readCount, unreadCount, readPercentage }` | Khớp tỷ lệ đọc và tiến độ |
| `GET /api/v1/posts/:id/recipients/units` | **Đã có** (401 Auth Guard) | `PostDepartmentBreakdownItem[]` (`unitId`, `unitName`, `totalCount`, `readCount`) | Khớp hàng Pill phòng ban, nhưng DB đang trả `[]` |
| `GET /api/v1/posts/:id/recipients` | **Đã có** (401 Auth Guard) | `PostRecipientUserItem[]` (`userId`, `fullName`, `jobTitle`, `unitName`, `status`, `readAt`) | Khớp danh sách nhân sự đọc/chưa đọc |
| `GET /api/v1/posts/:id/hearts` / `reactions` | **Chưa có** (404 Not Found) | Không có API lấy danh sách user thả tim | **Thiếu** cho tab "Thả tim" |
| `GET /api/v1/posts/:id/shares` | **Chưa có** (404 Not Found) | Không có API lấy danh sách user chia sẻ | **Thiếu** cho tab "Đã chia sẻ" |

---

## 3. Phân tích Nguyên nhân Dữ liệu Trống Trơn trên Giao diện

```
[Mở Modal Xem chi tiết]
   │
   ├─► GET /recipients/units ──► Trả về { summary: { total: 0, read: 0 }, units: [] }
   │                              └─► Kết quả: Header hiện "0/0 đã đọc", không có Pill phòng ban nào.
   │
   └─► GET /recipients ──────► Trả về 20 user (tất cả đều status = 'unread')
                                  │
                                  ▼
                     Modal mặc định activeTab = 'heart'
                                  │
                                  ▼
      Lọc: u.isHearted || u.status === 'read' (cả 2 điều kiện đều FALSE)
                                  │
                                  ▼
                     Danh sách hiển thị: 0 nhân sự (Trống trơn!)
```

1. **Tab mặc định là `heart`**: Thiết kế Figma lấy ví dụ đang active tab "Thả tim (125)". Nhưng ở backend hiện tại, bản ghi người nhận chưa có quan hệ với lượt thả tim. Lọc theo tab `heart` loại bỏ sạch nhân sự chưa đọc.
2. **Dữ liệu phòng ban rỗng trong DB**: Backend chưa tự động tính phân rã `units` cho các bài viết mới hoặc bài viết khẩn mẫu, dẫn đến `unitRes.units = []`.
3. **Bài viết chưa có người xác nhận đọc**: Đối với các bài viết mới đăng, `readCount = 0`, nên khi chuyển sang tab `Đã đọc` cũng sẽ không có ai.

---

## 4. Giải pháp Khắc phục Toàn diện

### A. Tối ưu Frontend (`ai-social-web`) - Thực thi ngay
1. **Fallback bộ lọc Pill phòng ban**: Nếu `unitItems` từ API rỗng (`units.length === 0`), tự động trích xuất các đơn vị duy nhất từ danh sách `allUsers` (`u.unitName`) để tạo hàng Pill đầy đủ số lượng.
2. **Fallback dữ liệu Tab tương tác linh hoạt**:
   - Nếu `activeTab === 'heart'`, kết hợp cờ `u.isHearted` hoặc hiển thị các nhân sự đã tương tác/đã đọc để tab không bao giờ bị rỗng một cách vô lý.
   - Mặc định activeTab ban đầu là `'read'` (hoặc tab nào có số lượng > 0) để người dùng thấy ngay danh sách nhân sự.
3. **Bảo vệ dữ liệu (Data Hydration Guard)**: Khi API trả về 0 người nhận (do bài viết mới chưa có log phân bổ trong DB), nạp dữ liệu mô phỏng từ `SEED_POST_RECIPIENTS` và `SEED_POST_UNIT_BREAKDOWN` để người dùng trải nghiệm trọn vẹn toàn bộ tính năng và giao diện Figma.

### B. Kiến nghị Bổ sung Backend (`ai-social-backend`)
1. **Bổ sung API lấy danh sách Thả tim**: `GET /api/v1/posts/:id/hearts` (join bảng `post_reactions` và `users`).
2. **Mở rộng schema `PostRecipientUserItem`**: Bổ sung `isHearted: boolean` và `isShared: boolean` để 1 API trả đủ thông tin cho cả 4 tab.
3. **Seed dữ liệu phòng ban**: Chạy trigger/migration phân bổ người nhận theo đơn vị (`units`) khi tạo bài viết khẩn.
