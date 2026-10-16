# Test Report: Kiểm thử Modal Chi tiết & Thống kê Tương tác (Figma Node #4361:14403)

- **Thời gian**: 2026-10-16 10:53
- **Đối tượng**: `PostStatsModalComponent`
- **Môi trường**: Angular 22, TypeScript 6, Node.js 25

---

## 1. Kết quả Biên dịch (Build Verification)
- **Lệnh thực thi**: `npm run build vnpt-ai-social-web --configuration production`
- **Trạng thái**: PASS (Exit code 0)
- **Cảnh báo (Warnings)**: 0
- **Lỗi (Errors)**: 0

---

## 2. Ma trận Kiểm thử Chức năng & Giao diện (Test Matrix)

| STT | Trường hợp kiểm thử (Test Case) | Kết quả kỳ vọng | Trạng thái |
|---|---|---|---|
| 1 | **Header Bar** | Hiển thị tag `Thông báo khẩn` (icon loa, viền hồng `#FCBBBE`), progress bar `182/230 đã đọc`, deadline `Đọc xong trước 11:00`, nút `✕` đóng modal. | PASS |
| 2 | **Post Summary Banner** | Gradient `#F0F7FE` $\rightarrow$ `#E7F2FE`, thumbnail 64x64px, tiêu đề bài viết (20px SemiBold), thời gian đăng và người đăng. | PASS |
| 3 | **4 Tab Tương tác** | Cho phép chuyển đổi giữa `Đã đọc`, `Thả tim` (active nền xanh, badge đỏ `#F52833`), `Đã chia sẻ`, `Chưa đọc`. Lọc đúng danh sách theo từng tab. | PASS |
| 4 | **Tìm kiếm real-time** | Ô tìm kiếm 180x40px lọc danh sách ngay theo họ tên, chức danh hoặc phòng ban khi người dùng nhập từ khoá. | PASS |
| 5 | **Bộ lọc phòng ban** | Click vào `Tất cả` hoặc từng phòng ban (`Ban Quản trị & Nhân sự`, `TT Sản phẩm...`) lọc chính xác nhân sự thuộc phòng ban đó. | PASS |
| 6 | **Hiển thị hàng nhân sự** | Avatar tròn 32px, họ tên, chức vụ, timestamp tương tác, icon 2 tích xanh dương `✓✓` và trái tim đỏ `favourite`. | PASS |
| 7 | **Hành động Footer** | Nút `Đóng` phát emit `closed`, nút `Xuất Excel` tải về file CSV UTF-8 BOM có dấu tiếng Việt không lỗi font. | PASS |
| 8 | **Quy tắc Code Quality (<200 LOC)** | `ts`: 141 lines, `html`: 144 lines, `scss`: 168 lines. Tất cả đều <200 dòng theo đúng `GEMINI.md`. | PASS |
