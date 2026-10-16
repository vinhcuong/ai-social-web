# QA & Test Report: Bộ Soạn thảo Composer (Auto-grow, Emoji Popover & Modal Lên lịch)

- **Thời gian**: 2026-10-16 10:05
- **Task**: `composer-textarea-emoji-schedule-figma-sync`
- **Môi trường**: Angular 22.0.5, Node v25.6.1, macOS Darwin

---

## 1. Test Matrix & Kết quả

| Test Case | Mô tả kiểm thử | Kết quả mong đợi | Thực tế | Trạng thái |
|---|---|---|---|---|
| TC-01 | Resize textfield | Không còn icon kéo `//` ở góc phải textarea | Ẩn hoàn toàn qua `resize: none !important;` và `&::-webkit-resizer` | **PASS** |
| TC-02 | Auto-expand textarea | Chiều cao tự nở khi gõ nhiều dòng, thu gọn khi xóa | Tự giãn từ 44px đến tối đa 320px qua `field-sizing: content` & `onAutoGrow` | **PASS** |
| TC-03 | Emoji Overlay Multi-select | Bấm icon cười mở popup, click nhiều emoji | Emojis lần lượt chèn vào textarea, popup không bị đóng | **PASS** |
| TC-04 | Emoji Search & Tabs | Gõ tìm kiếm hoặc chuyển tab danh mục | Lọc icon chuẩn xác, tab active đổi màu | **PASS** |
| TC-05 | Click outside Emoji | Bấm ra ngoài popup | Popup tự động đóng | **PASS** |
| TC-06 | Emergency Channel | Không còn khối "Đọc xong trước" (`deadlineText`) | Khối deadline cũ đã bị xóa sạch | **PASS** |
| TC-07 | Figma Schedule Modal | Mở modal lên lịch `#4496:33933` | Modal hiển thị banner dynamic `#DBE9FF` với câu thứ/ngày/giờ | **PASS** |
| TC-08 | Month Calendar Popover | Chọn ngày trong lịch tháng `#4537:42280` | Lịch tháng hiển thị chuẩn `T2-CN`, cập nhật ngày đã chọn | **PASS** |
| TC-09 | Time Picker Popover | Chọn giờ/phút trong popup `#4537:42815` | Cột giờ/phút hiển thị chuẩn, highlight dòng đang chọn | **PASS** |
| TC-10 | Schedule Submit Payload | Lên lịch hẹn và bấm đăng | Nút chuyển thành "Lên lịch", payload gửi `status: 'scheduled'` và `scheduledPublishAt` | **PASS** |
| TC-11 | Quy chuẩn 200 dòng | Kiểm tra độ dài các file source | Tất cả file `.ts`, `.html` đều ≤ 198 dòng | **PASS** |

---

## 2. Kết luận
Bộ tính năng soạn thảo đã sẵn sàng 100%, thỏa mãn đầy đủ 4 yêu cầu của người dùng và thiết kế Figma Desktop 3.1.
