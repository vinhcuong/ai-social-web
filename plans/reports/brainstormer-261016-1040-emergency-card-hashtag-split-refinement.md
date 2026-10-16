---
title: "Brainstorm: Tách Hashtag Phân Loại Xuống Dưới & Giữ Trạng Thái/Đối Tượng/Nút Tác Vụ Ở Trên Cùng"
description: "Phân tích và thống nhất giải pháp tách biệt: Giữ nguyên Đang phát, Toàn công ty, Chia sẻ, Copy link ở đầu thẻ (Hình 1 Design), chỉ đưa duy nhất phần hashtag (# Category) xuống trên footer Xác nhận đã đọc."
status: decided
topic: "emergency-card-hashtag-split-refinement"
chosen_option: "Option 1: Khôi phục emerg-tags-actions-row ở trên cùng (trừ category) và tạo emerg-hashtag-row ở dưới"
date: 2026-10-16
tags: [emergency-channel, post-card, ui-refinement, hashtag-placement, figma-alignment]
---

# Brainstorm Report: Tách Hashtag Phân Loại Xuống Dưới & Giữ Cụm Trạng Thái Ở Đỉnh Thẻ

## Executive Summary
Người dùng phản hồi đối chiếu giữa **Hình 1 (Design)** và **Hình 2 (Hiện trạng)**:
- **Hiện trạng (Hình 2)**: Toàn bộ hàng `emerg-tags-actions-row` (gồm cả `Đang phát`, `Toàn công ty`, nút `Chia sẻ` và `Copy link`) bị chuyển xuống đáy thẻ, khiến phần đầu thẻ bị trống nút tác vụ và mất huy hiệu đối tượng bên cạnh ảnh đại diện.
- **Yêu cầu (Hình 1)**: 
  1. **Ở trên cùng (Head)**: Giữ nguyên `Đang phát` / `Đã kết thúc`, huy hiệu đối tượng `Toàn công ty` và hai nút `Chia sẻ`, `Copy link` ngang hàng trên cùng cạnh thumbnail 110x110 (chuẩn 100% theo Hình 1).
  2. **Ở dưới (Above Footer)**: **Chỉ đưa duy nhất phần hashtag** (`# An toàn thông tin`, `# ...`) xuống vị trí phía trên footer `✓ Xác nhận đã đọc` và `Danh sách chi tiết`.

---

## Context & Objectives
- **Hình 1 (Design)**:
  - Dòng 1: Trái có badge đối tượng `Toàn công ty` (nền tím pastel `#F5F2FD`, viền `#D1C4F2`, chữ `#5F31D3`), phải có 2 nút `Chia sẻ` và `Copy link`.
  - Dòng 2: Tiêu đề in đậm `Thông báo khám sức khoẻ định kỳ`.
  - Dòng 3: Dòng phụ `Thời gian đăng: 08:00 • Người đăng: Nguyễn Hiền`.
- **Vấn đề ở Hình 2 (Hiện trạng)**: Cả 3 badge (`Đang phát`, `# An toàn thông tin`, `Toàn công ty`) và cả 2 nút tác vụ đều dồn xuống đáy thẻ, sai lệch với bố cục đầu bài của Hình 1.
- **Mục tiêu**:
  - Tách bạch cấu trúc HTML thẻ bài viết thông báo khẩn:
    - **Header Row** (trên cùng cạnh thumbnail): Badge trạng thái (`Đang phát`/`Đã kết thúc`), Badge đối tượng (`Toàn công ty`), Nút `Chia sẻ`, Nút `Copy link`.
    - **Hashtag Row** (ngay trên footer): Chỉ hiển thị các hashtag phân loại chủ đề (ví dụ: `# An toàn thông tin`).
  - Đảm bảo file template và SCSS duy trì dưới 200 dòng theo quy tắc `GEMINI.md`.

---

## Đối Chiếu Layout Trực Quan

### Cấu trúc Chuẩn theo Yêu cầu Người dùng (Hình 1 & Báo cáo)
```text
┌────────────────────────────────────────────────────────────────────────┐
│ [110x110]  [Toàn công ty] (hoặc [Đang phát])     [Chia sẻ] [Copy link] │ <- Trên cùng
│ Thumbnail  CẢNH BÁO BẢO MẬT: Phát hiện mã độc...                       │ <- Tiêu đề
│            Phát lúc 09:16 • Người đăng: Đồng Anh Vĩnh Cường            │ <- Sub meta
├────────────────────────────────────────────────────────────────────────┤
│ Hiện trạng: Hệ thống tường lửa ghi nhận lưu lượng tấn công bất thường  │
│ Cần làm ngay: Tuyệt đối không mở các email có tệp đính kèm .iso lạ     │
├────────────────────────────────────────────────────────────────────────┤
│ [Lưới ảnh / Media đính kèm nếu có]                                     │
├────────────────────────────────────────────────────────────────────────┤
│ # An toàn thông tin                                                    │ <- Chỉ mỗi hashtag ở đây
├────────────────────────────────────────────────────────────────────────┤
│ [✓ Xác nhận đã đọc]                           0 / 320 đã đọc • Chi tiết│ <- Footer xác nhận
└────────────────────────────────────────────────────────────────────────┘
```

---

## Phân tích Phương án Triển khai (Evaluated Options)

### Option 1: Tách rời thành Header Actions Row và Hashtag Row (Khuyến nghị)
- **Cụm Header (`emerg-head-content`)**:
  - Giữ lại `<div class="emerg-tags-actions-row">`:
    - Bên trái: `@if (isUrgentBroadcast(post)) { <span class="tag-pill broadcasting">Đang phát</span> }` và `<span class="tag-pill audience">{{ getAudienceLabel(post) }}</span>`.
    - Bên phải: Nút `Chia sẻ` và nút `Copy link`.
  - Ngay dưới là `emerg-title-sub-group` (Tiêu đề và thời gian/người đăng).
- **Cụm Hashtags (`emerg-hashtag-row`) phía trên footer**:
  - Đặt ngay sau `emerg-info-detail-box` / `emerg-media-grid` và ngay trước `<footer class="emerg-note-footer">`:
    ```html
    @if (post.categoryCode) {
      <div class="emerg-hashtags-row">
        <span class="tag-pill category"># {{ getCategoryLabel(post.categoryCode) }}</span>
      </div>
    }
    ```
- **Ưu điểm**:
  - Tái hiện 100% chuẩn xác thiết kế tại **Hình 1**.
  - Đưa hashtag phân loại xuống dưới đúng nghĩa "phần hashtag" như người dùng mong muốn, không làm ảnh hưởng đến các nút chia sẻ và đối tượng nhận tin.
  - Sạch sẽ, đơn giản, chỉ cần thêm 1 class nhỏ `.emerg-hashtags-row` (hoặc tái sử dụng `.tag-pill.category`).
- **File size**: Template tăng thêm ~8 dòng (tổng ~196 dòng), hoàn toàn tuân thủ `< 200 dòng/file`.

---

### Option 2: Giữ cả hàng actions ở dưới và duplicate lại nút ở trên
- **Nhược điểm**: Trùng lặp nút bấm (2 nút Chia sẻ, 2 nút Copy link), gây rối mắt và lãng phí không gian. Không đúng với tinh thần KISS/DRY.

---

## Ma trận Đánh giá (Trade-off Matrix)

| Tiêu chí | Option 1 (Khuyến nghị) | Option 2 (Trùng lặp) |
|---|---|---|
| Khớp 100% Hình 1 Design | **5/5 (Hoàn hảo)** | 2/5 (Thừa nút) |
| Đúng ý "chỉ đưa mỗi hashtag" | **5/5 (Chính xác)** | 2/5 |
| Trải nghiệm người dùng (UX) | **5/5 (Thoáng đãng, rõ ràng)** | 3/5 |
| Tuân thủ file < 200 dòng | **5/5 (~196 dòng)** | 3/5 |

---

## Quyết định Kỹ thuật (Final Decision)
- **Thực hiện Option 1**:
  1. Đưa `emerg-tags-actions-row` quay trở lại đỉnh `emerg-head-content`, nhưng loại bỏ nhãn `category` khỏi hàng này (chỉ giữ lại `broadcasting`/`ended`, `audience`, và 2 nút tác vụ).
  2. Tạo khối `<div class="emerg-hashtags-row">` nằm ở dưới cùng của thân bài (ngay trên footer `emerg-note-footer`), bên trong chỉ chứa duy nhất nhãn `# {{ getCategoryLabel(post.categoryCode) }}`.

---

## Các Bước Tiếp Theo (Next Steps)
1. Xác nhận phương án với người dùng và chuyển sang `/planning` hoặc `/cook`.
2. Chỉnh sửa template `emergency-channel-view.component.html` và SCSS.
3. Chạy `npm run build` để xác thực 0 lỗi biên dịch và kiểm tra hiển thị.
