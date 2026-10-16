# Test Report: Kiểm thử Tách Hashtag Thẻ Thông Báo Khẩn (Figma Alignment)

- **Thời gian**: 2026-10-16 11:05
- **Đối tượng**: `EmergencyChannelViewComponent`
- **Môi trường**: Angular 22, TypeScript 6, Node.js 25

---

## 1. Kết quả Biên dịch (Build Verification)
- **Lệnh thực thi**: `npm run build vnpt-ai-social-web --configuration production`
- **Trạng thái**: PASS (Exit code 0)
- **Cảnh báo (Warnings)**: 0
- **Lỗi (Errors)**: 0

---

## 2. Ma trận Kiểm thử Chức năng & Bố cục (Test Matrix)

| STT | Trường hợp kiểm thử (Test Case) | Kết quả kỳ vọng | Trạng thái |
|---|---|---|---|
| 1 | **Header Row (Cạnh Thumbnail 110x110)** | Hiển thị badge `Đang phát` (hoặc `Đã kết thúc`), badge `Toàn công ty` ở bên trái; 2 nút `Chia sẻ` và `Copy link` ở bên phải. | PASS |
| 2 | **Tiêu đề & Dòng Metadata** | Nằm ngay dưới hàng tags/actions ở đầu thẻ, hiển thị rõ ràng `Phát lúc...` và `Người đăng...`. | PASS |
| 3 | **Hashtags Row (Trên Footer)** | Nằm ngay trên `<footer class="emerg-note-footer">`, chỉ hiển thị duy nhất nhãn `# [Chuyên mục]` (ví dụ: `# An toàn thông tin`), không có nút Chia sẻ hay badge Toàn công ty ở đây. | PASS |
| 4 | **Footer Xác nhận đọc** | Giữ nguyên nút `✓ Xác nhận đã đọc` / `✓ Đã đọc` và link `Danh sách chi tiết`. | PASS |
| 5 | **Giới hạn số dòng (<200 LOC)** | HTML: 191 lines, SCSS: 197 lines. Cả 2 file đều < 200 dòng theo đúng `GEMINI.md`. | PASS |
