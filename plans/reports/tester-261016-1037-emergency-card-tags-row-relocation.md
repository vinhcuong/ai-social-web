# QA & Test Report: Tái Bố Cục Thẻ Thông Báo Khẩn (Dời Hàng Tags/Hashtags Xuống Phía Trên Footer)

- **Thời gian**: 2026-10-16 10:37
- **Task Slug**: `emergency-card-tags-row-relocation`
- **Môi trường**: Angular 22.0.5, Node v25.6.1, macOS Darwin

---

## 1. Test Matrix & Kết quả

| Test Case | Mô tả kiểm thử | Kết quả mong đợi | Thực tế | Trạng thái |
|---|---|---|---|---|
| TC-01 | Tiêu đề ở đỉnh bài viết | Kiểm tra phần đầu `emerg-top-row` bên cạnh thumbnail | Tiêu đề `h2.emerg-title` và thời gian/tác giả hiển thị ở đỉnh, không bị tags che | **PASS** |
| TC-02 | Hàng Tags & Actions trên Footer | Kiểm tra vị trí `emerg-tags-actions-row` | Nằm ngay phía trên `emerg-note-footer` (Xác nhận đã đọc & Danh sách chi tiết) | **PASS** |
| TC-03 | Nút Chia sẻ | Bấm nút Chia sẻ | Phát sự kiện `shareRequested.emit` mở modal chia sẻ bài viết | **PASS** |
| TC-04 | Nút Copy link | Bấm nút Copy link | Sao chép liên kết vào clipboard và hiển thị thông báo thành công | **PASS** |
| TC-05 | Nút Xác nhận đã đọc | Bấm nút Xác nhận đã đọc | Cập nhật trạng thái sang `✓ Đã đọc` và tăng số lượt đã đọc | **PASS** |
| TC-06 | Link Danh sách chi tiết | Bấm link Danh sách chi tiết | Phát sự kiện `statsRequested.emit` mở modal thống kê và nhắc nhở 3 cấp | **PASS** |
| TC-07 | Production Build & File Size | Chạy `npm run build` và kiểm tra `wc -l` | Build thành công 0 lỗi trong 2.76s; tất cả file đều ≤ 189 dòng (< 200 dòng) | **PASS** |

---

## 2. Kết luận
Tái bố cục thẻ thông báo khẩn đã hoàn thành đúng theo snippet và vị trí người dùng chỉ định, giao diện rõ ràng, phân cấp thị giác hợp lý.
