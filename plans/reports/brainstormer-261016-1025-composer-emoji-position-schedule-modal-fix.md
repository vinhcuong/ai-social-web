---
title: "Brainstorm: Khắc phục lỗi hiển thị Emoji Popover & Modal Lên Lịch Bài Đăng"
description: "Phân tích nguyên nhân gốc rễ và đề xuất giải pháp xử lý triệt để: Emoji Popover bị khuất trên, xoá tip dư thừa và Modal Lên Lịch bị kẹt Backdrop mờ không hiển thị Dialog."
status: decided
topic: "composer-emoji-position-schedule-modal-fix"
chosen_option: "Dynamic Flip Emoji Popover + Ng-Zorro nz-modal Portal Teleport"
date: 2026-10-16
tags: [composer, ui-fix, emoji-popover, schedule-modal, ng-zorro, figma-sync]
---

# Brainstorm Report: Khắc phục lỗi hiển thị Emoji Popover & Modal Lên Lịch Bài Đăng

## Executive Summary
Báo cáo phân tích và giải quyết triệt để 3 vấn đề người dùng phản hồi kèm ảnh thực tế:
1. **Emoji Popover bị đẩy lên trên che khuất (Hình 1)**: Do thuộc tính cố định `bottom: calc(100% + 10px)` khi thanh công cụ ở gần đỉnh màn hình hoặc khi composer thu gọn (chiều cao chỉ ~56px) khiến popover (cao ~380px) bị tràn ra ngoài mép trên màn hình.
2. **Xóa dòng chữ dư thừa**: Loại bỏ hoàn toàn dòng tip footer `"Chọn liên tiếp để chèn nhiều biểu tượng"` theo yêu cầu người dùng để giảm chiều cao và giao diện gọn gàng.
3. **Modal Lên lịch chỉ thấy mờ UI (Hình 2)**: Do ancestor container `.emergency-main-container` có thuộc tính `backdrop-filter: blur(6px)`. Theo đặc tả W3C CSS, `backdrop-filter` biến container thành *containing block* cho tất cả phần tử `position: fixed` con, giam lỏng backdrop modal bên trong container và căn giữa dialog tít dưới đáy trang (ngoài tầm nhìn). Đồng thời `effect()` ghi signal mà thiếu `{ allowSignalWrites: true }` gây lỗi runtime Angular NG0600. Giải pháp tối ưu: Chuyển modal sang sử dụng `<nz-modal>` (teleport ra `document.body` tương tự `AiSocialShareModalComponent`).

---

## Context & Objectives
- **Vấn đề 1 (Emoji popover)**: Khi bấm icon mặt cười ở trạng thái card thu gọn hoặc đầu trang, phần tìm kiếm và tab icon bị che khuất khỏi viewport.
- **Vấn đề 2 (Tip text)**: Dòng chữ hướng dẫn không cần thiết làm cho popover cồng kềnh, người dùng yêu cầu xóa bỏ.
- **Vấn đề 3 (Invisible Dialog)**: Người dùng bấm icon lịch, cả màn hình tối mờ đi (`backdrop-filter: blur(2px)`) nhưng không thấy hộp thoại lịch đâu.
- **Ràng buộc**: Tuân thủ quy tắc kích thước file < 200 dòng (`GEMINI.md`), giữ nguyên 100% thiết kế Figma Node `#4496:33933`, `#4537:42280`, `#4537:42815`.

---

## Phân tích Nguyên nhân Gốc rễ (Root Cause Analysis)

### 1. Emoji Popover bị che khuất
* **Hiện trạng trong SCSS**:
  ```scss
  :host {
    position: absolute;
    bottom: calc(100% + 10px);
    left: 0;
    z-index: 1050;
  }
  ```
* **Lỗi logic**: Luôn mở theo hướng *Bottom-up*. Khi composer chưa mở rộng (`expanded() === false`), vị trí của icon cười chỉ cách mép trên màn hình ~120px. Popover cao ~380px bị đẩy lên trên 260px, nằm ngoài khung nhìn người dùng.

### 2. Dòng tip dư thừa
* Nằm tại dòng 47-50 của `emoji-picker-popover.component.html`:
  ```html
  <div class="popover-footer-tip">Chọn liên tiếp để chèn nhiều biểu tượng</div>
  ```
* Chiếm diện tích 28px chiều cao, không còn cần thiết.

### 3. Modal Lên lịch bị "tàng hình" (Hình 2)
* **Nguyên nhân CSS Stacking Context & Containing Block**:
  Tại `emergency-channel-view.component.scss`:
  ```scss
  .emergency-main-container {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(6px); // <-- THỦ PHẠM CHÍNH
  }
  ```
  Theo chuẩn CSS Transforms & Filters Module: Bất kỳ phần tử nào có `backdrop-filter` khác `none` đều trở thành **Containing Block** cho các phần tử con có `position: fixed`.
  Do đó, `.schedule-modal-backdrop` (với `position: fixed; inset: 0`) **không hề bám theo màn hình trình duyệt (viewport)** mà bị giới hạn kích thước theo `.emergency-main-container`. Do container này chứa toàn bộ feed bài viết dài hàng nghìn pixel, CSS `display: flex; align-items: center; justify-content: center` đã căn giữa `.schedule-modal-dialog` tại vị trí giữa của container (ở độ cao ~1200px - 2000px, nằm tít phía dưới trang web).
  Người dùng đang ở đỉnh trang chỉ nhìn thấy lớp nền tối mờ, còn dialog thì nằm xa tít phía dưới cuộn trang!
* **Nguyên nhân Angular Signal Effect**:
  Trong `post-schedule-modal.component.ts`:
  ```ts
  effect(() => {
    if (this.visible()) {
      this.selectedDate.set(base); // Nguy cơ NG0600 nếu không có allowSignalWrites: true
    }
  });
  ```

---

## Đánh giá các Phương án Giải quyết (Evaluated Options)

### Cho Vấn đề 1 & 2: Emoji Popover
* **Phương án A (Khuyến nghị)**: Thêm cơ chế **Dynamic Flip Placement** (`placement: 'top' | 'bottom'`).
  - Khi mở popover, kiểm tra vị trí của nút kích hoạt: Nếu khoảng cách từ nút đến mép trên màn hình < 380px hoặc khi composer chưa mở rộng (`!expanded()`), đặt class `.placement-bottom` (`top: calc(100% + 8px); bottom: auto`). Ngược lại đặt `.placement-top`.
  - Xóa bỏ thẻ `<div class="popover-footer-tip">` trong template và SCSS.
  - *Ưu điểm*: Gọn nhẹ, không cần thêm thư viện phức tạp, popover luôn hiển thị 100% trọn vẹn trong màn hình.

---

### Cho Vấn đề 3: Modal Lên lịch
#### Phương án 1: Sử dụng `<nz-modal>` Teleport Portal (Khuyến nghị)
* **Ý tưởng**:
  - Tái cấu trúc `PostScheduleModalComponent` sử dụng component chuẩn `<nz-modal>` của Ng-Zorro:
    ```html
    <nz-modal
      [nzVisible]="visible()"
      [nzTitle]="null"
      [nzFooter]="null"
      [nzWidth]="560"
      nzClassName="figma-schedule-modal"
      (nzOnCancel)="visible.set(false)"
    >
      <ng-container *nzModalContent>
        <!-- Giữ nguyên 100% UI Figma: Head, Dynamic Banner, Date composite, Time composite, Footer -->
      </ng-container>
    </nz-modal>
    ```
  - Thay vì `effect()`, khởi tạo state ngày giờ thông qua method hoặc setter khi `visible` chuyển sang true.
* **Ưu điểm**:
  - `nz-modal` tự động gắn vào `cdk-overlay-container` (ngay dưới `<body>`), miễn nhiễm 100% với `backdrop-filter` hay `overflow` của mọi component cha.
  - Căn giữa hoàn hảo trên màn hình ở mọi vị trí cuộn trang.
  - Đồng bộ kiến trúc với các modal khác trong dự án (`AiSocialShareModalComponent`, `MediaLightboxModalComponent`).
* **Nhược điểm**: Cần điều chỉnh một chút CSS modal wrap của Ng-Zorro (padding = 0 để custom dialog Figma hiển thị chuẩn).

#### Phương án 2: Bỏ `backdrop-filter: blur(6px)` ở `.emergency-main-container`
* **Ý tưởng**: Xóa bỏ `backdrop-filter` của container chính để `position: fixed` hoạt động bình thường.
* **Nhược điểm**: Phá vỡ phong cách Glassmorphism của toàn bộ trang kênh khẩn cấp; không giải quyết được vấn đề nếu sau này các kênh khác cũng dùng `backdrop-filter` hoặc `transform`.

---

## Ma trận Đánh giá (Trade-off Matrix)

| Tiêu chí | Phương án 1 (nz-modal Teleport) | Phương án 2 (Bỏ CSS cha) |
|---|---|---|
| Độ tin cậy hiển thị | **5/5 (Tuyệt đối)** | 3/5 (Dễ hồi quy) |
| Bảo toàn Design System | **5/5 (Giữ nguyên Glassmorphism)** | 2/5 (Mất hiệu ứng kính) |
| Chuẩn kiến trúc dự án | **5/5 (Đồng bộ ShareModal, Lightbox)** | 2/5 (Cá biệt) |
| Thời gian xử lý | **Nhanh (~30 phút)** | Nhanh (~20 phút) |

---

## Quyết định Kỹ thuật (Final Decision)
1. **Emoji Popover**:
   - Thêm tính toán vị trí động: Tự động lật xuống dưới (`placement: 'bottom'`) khi khoảng cách phía trên < 380px.
   - Xóa bỏ dòng chữ `"Chọn liên tiếp để chèn nhiều biểu tượng"`.
2. **Modal Lên lịch**:
   - Sử dụng `<nz-modal>` bọc nội dung Figma của `PostScheduleModalComponent`, giải thoát modal ra khỏi containing block của container chính.
   - Xóa `effect()` gây lỗi NG0600, thay bằng logic cập nhật an toàn trong `ngOnChanges` hoặc handler kích hoạt.

---

## Kế hoạch Thực hiện Tiếp theo (Next Steps)
1. Chuyển sang `/cook` hoặc tạo plan để cập nhật mã nguồn theo đúng kết luận trên.
2. Kiểm thử xác nhận bằng build và kiểm tra giao diện trên trình duyệt.
