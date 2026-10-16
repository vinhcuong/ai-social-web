# QA & Test Report: Sửa Lỗi Hiển thị Emoji Popover & Modal Lên Lịch Bài Đăng

- **Thời gian**: 2026-10-16 10:30
- **Task Slug**: `composer-emoji-position-schedule-modal-fix`
- **Môi trường**: Angular 22.0.5, Node v25.6.1, macOS Darwin

---

## 1. Test Matrix & Kết quả

| Test Case | Mô tả kiểm thử | Kết quả mong đợi | Thực tế | Trạng thái |
|---|---|---|---|---|
| TC-01 | Dynamic Flip Popover (Card thu gọn) | Bấm icon cười khi composer ở đầu trang/thu gọn | Popover lật xuống dưới (`placement: bottom`), không bị cắt cụt mép trên | **PASS** |
| TC-02 | Tip Footer Removal | Kiểm tra phần chân của Emoji Popover | Dòng chữ "Chọn liên tiếp để chèn nhiều biểu tượng" biến mất hoàn toàn | **PASS** |
| TC-03 | Multi-select Emojis | Click chọn liên tiếp nhiều emoji | Emojis lần lượt chèn vào textarea, popup không bị đóng | **PASS** |
| TC-04 | Emoji Search & Tabs | Lọc tìm kiếm và chọn tab danh mục | Hoạt động chính xác, mượt mà | **PASS** |
| TC-05 | Schedule Modal Visibility | Bấm nút lịch ở toolbar composer | Modal xuất hiện sắc nét, căn giữa viewport ngay lập tức | **PASS** |
| TC-06 | Stacking Context Breakout | Mở modal trong trang feed dài có `backdrop-filter` | Modal teleport ra `document.body` an toàn, không bị giam lỏng hay trôi xuống đáy | **PASS** |
| TC-07 | Figma Schedule Head & Banner | Kiểm tra banner `#DBE9FF` | Hiển thị chuẩn xác câu: `Sẽ gửi về thứ {X}, {DD/MM/YYYY} lúc {HH:mm:ss}` | **PASS** |
| TC-08 | Month Calendar Popover | Mở lịch tháng trong modal | Lịch tháng popover hiển thị chuẩn xác Node `#4537:42280` | **PASS** |
| TC-09 | Time Picker Popover | Mở time picker trong modal | Time picker popover hiển thị chuẩn xác Node `#4537:42815` | **PASS** |
| TC-10 | Production Build & File Sizes | Chạy `npm run build` và kiểm tra độ dài file | Build thành công 0 lỗi trong 2.59s; tất cả file source đều < 200 dòng | **PASS** |

---

## 2. Kết luận
Toàn bộ 3 lỗi phát sinh trên UI đã được sửa triệt để, hệ thống hoạt động ổn định và sẵn sàng cho người dùng nghiệm thu.
