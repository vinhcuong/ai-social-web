---
title: "Brainstorm: Media & File Load Error Handling with Graceful Fallback Placeholder"
description: "Xử lý lỗi tải ảnh/video/file đính kèm trên AI Social Web bằng Placeholder thanh lịch có thông báo lỗi nhỏ, thay thế khối giao diện đen/đỏ thô ráp."
status: decided
topic: "media-load-error-placeholder"
chosen_option: "Option 1: Reusable Standalone Component AppMediaTileComponent with Error State & Retry"
date: 2026-10-16
tags: [frontend, angular22, ui-ux, media, placeholder, error-handling]
---

# Brainstorm Report: Media & File Load Error Handling (Graceful Placeholder)

## Executive Summary

Hiện tại, khi ảnh hoặc video đính kèm gặp lỗi tải (link MinIO/S3 404, CORS, SSL chứng chỉ nội bộ port 9000, hoặc URL ký `X-Amz-Expires` hết hạn), trình duyệt không decode được và vùng hiển thị biến thành **khối hộp đen đặc (`#0f172a`) hoặc khối đỏ thẫm** kèm biểu tượng ảnh vỡ 16px nhỏ xíu. Chúng tôi đề xuất giải pháp tối ưu: Chuẩn hóa thành một Standalone Component **`AppMediaTileComponent`** (kết hợp fallback directive) quản lý 3 trạng thái (`loading` shimmer skeleton, `loaded` hiển thị thật, `error` placeholder xám trang nhã kèm icon cảnh báo, tên file, badge báo lỗi và nút "Thử lại").

---

## Context & Objectives

### 1. Hiện trạng & Phân tích nguyên nhân gốc (Root Cause)
- **Vấn đề trên giao diện**:
  - Tại `emergency-channel-view`, `event-channel-view` và `post-card`, thẻ `<img>` và `<video>` được render thô:
    ```html
    <div class="media-tile">
      <img [src]="getMediaUrl(media)" [alt]="media.fileName" class="tile-media" />
    </div>
    ```
  - Trong SCSS, `.media-tile` đang để mặc định:
    ```scss
    .media-tile {
      background: #0f172a; /* Slate 900 - Nền xanh đen tối màu */
      overflow: hidden;
    }
    ```
  - Khi presigned S3 URL (`https://files-goconnect.vnpt.vn:9000/..._thumb.jpg?X-Amz-Expires=3600...`) bị lỗi mạng, chứng chỉ HTTPS self-signed ở port 9000 hoặc quá hạn token:
    1. Thẻ `<img>` rơi vào sự kiện `(error)`, không có ảnh để hiển thị.
    2. Nền container `#0f172a` lộ ra nguyên vẹn thành một khối hộp đen xì khổng lồ với icon gãy vỡ (Broken Image Icon) ở góc trái.
    3. Ở một số ngữ cảnh (hoặc bài đăng khẩn cấp có overlay/theme đỏ), mảng màu bị biến dạng thành một khối đỏ đặc dị thường, gây cảm giác ứng dụng bị crash nghiêm trọng.
    4. Thẻ `<video>` khi lỗi nguồn phát cũng rơi vào trạng thái màn hình đen câm lặng.

### 2. Yêu cầu của User
- Tuyệt đối không để khối UI đen/đỏ xấu xí làm hỏng layout bài viết.
- Khi ảnh/video/file không tải được:
  - Hiển thị **khung placeholder thanh lịch, trung tính** (xám sáng `#f8fafc` hoặc nền card hài hòa).
  - Có **icon nhận diện lỗi nhỏ** (Broken Image / Video Alert / File Unavailable).
  - Có **dòng thông báo lỗi súc tích** để user hiểu rõ (VD: *"Không thể tải ảnh"*, kèm tên tệp gốc).
  - Giữ nguyên tỷ lệ khung hình (Aspect Ratio / Grid Layout) để không làm giật khung (Layout Shift).
  - Cung cấp thao tác hỗ trợ: Nút *"Thử lại"* hoặc mở trực tiếp link tải.

---

## Visual Design Wireframe (UI/UX Đề xuất)

### Trạng thái Thất bại (Error Placeholder) trên Grid 1-Ảnh hoặc Multi-Grid:

```text
┌──────────────────────────────────────────────────────────────────┐
│  .media-tile (background: #f8fafc; border: 1px dashed #cbd5e1)   │
│                                                                  │
│                        ┌───────────┐                             │
│                        │   [ ✕ ]   │  ← Icon ảnh hỏng (40x40)    │
│                        └───────────┘    (Màu #94a3b8 / #ef4444)  │
│                                                                  │
│                     Không thể tải hình ảnh                       │
│             incident-diagram.png (S3 link hết hạn)               │
│                                                                  │
│             ┌─────────────────┐   ┌─────────────────┐            │
│             │   ↻ Thử lại     │   │ ↗ Mở link gốc   │            │
│             └─────────────────┘   └─────────────────┘            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

- **Màu sắc nền**: `#f8fafc` (slate-50) dịu mắt, viền mềm `1px dashed #cbd5e1` (slate-300).
- **Typography**: 
  - Tiêu đề lỗi: 13px font-weight 600, màu `#475569` (slate-600).
  - Tên file & chú thích: 11px font-weight 400, màu `#94a3b8` (slate-400), cắt ngắn nếu quá dài.
- **Micro-actions**:
  - `↻ Thử lại`: Kích hoạt trigger reload lại ảnh kèm tham số `_retry=timestamp` hoặc yêu cầu cấp lại presigned URL.
  - `↗ Mở liên kết`: Mở URL trong tab mới nếu người dùng muốn tự xác thực trực tiếp trên trình duyệt.

---

## Evaluated Options

### Option 1: Standalone Component `<app-media-tile>` (Recommended)
- **Concept**:
  - Xây dựng component dùng chung `AppMediaTileComponent` tại `src/app/shared/media-tile/` (hoặc `features/ai-social/components/media-tile/`).
  - Đóng gói toàn bộ logic hiển thị cho 1 ô media:
    - Input: `attachment: AttachmentItem`, `countOverlay?: number`, `aspectRatio?: string`.
    - Internal signals: `loadState = signal<'loading' | 'loaded' | 'error'>('loading')`, `retryCount = signal<number>(0)`.
    - Xử lý sự kiện `(load)="onLoaded()"`, `(error)="onError()"`.
    - Hỗ trợ cả `<img>` và `<video>` với cơ chế fallback đồng nhất.
  - Thay thế code lặp lại ở cả 3 nơi: `emergency-channel-view`, `event-channel-view`, `post-card`.
- **Ưu điểm**:
  - **KISS & DRY tuyệt đối**: Xóa bỏ code lặp ở 3 view lớn, mọi logic error handling, skeleton loading và retry tập trung 1 nơi.
  - **UX vượt trội**: Có skeleton shimmer khi đang tải, placeholder khi lỗi, click mở Lightbox chỉ kích hoạt khi ảnh đã sẵn sàng.
  - **Mở rộng dễ dàng**: Khi backend bổ sung API refresh presigned S3 token, chỉ cần gắn service vào component này.
- **Nhược điểm & Rủi ro**:
  - Cần chỉnh sửa lại template của 3 component cha để dùng `<app-media-tile>`.
- **Ước tính nỗ lực**: ~2 - 3 giờ.

---

### Option 2: Angular Directive `[appMediaFallback]`
- **Concept**:
  - Viết 1 directive gắn trực tiếp lên thẻ `<img [src]="url" appMediaFallback>` hoặc `<video>`.
  - Directive lắng nghe sự kiện `@HostListener('error')`:
    - Thay thế thuộc tính `src` bằng Data URI SVG placeholder, hoặc
    - Ẩn phần tử thẻ img/video (`display: none`) và inject dynamic DOM element chứa khối placeholder xám.
- **Ưu điểm**:
  - Không cần sửa đổi nhiều cấu trúc DOM cha.
- **Nhược điểm & Rủi ro**:
  - Thay thế bằng Data URI SVG không cho phép người dùng click nút "Thử lại" hoặc tùy biến tương tác.
  - Thao tác can thiệp DOM từ directive trái với triết lý OnPush & Signals hiện đại của Angular 22, dễ gây memory leak hoặc layout shift.
  - Video không tương thích tốt với Data URI SVG fallback.
- **Ước tính nỗ lực**: ~2 giờ.

---

### Option 3: Xử lý Inline bằng Flag Set trong từng Component
- **Concept**:
  - Trong mỗi component cha (`emergency-channel-view.component.ts`, v.v.), khai báo một `failedMediaIds = signal<Set<string>>(new Set())`.
  - Trên template gắn `(error)="onMediaError(media.id)"`, sau đó dùng `@if (failedMediaIds().has(media.id)) { ... } @else { <img ...> }`.
- **Ưu điểm**:
  - Cực nhanh, làm ngay trong 30 phút.
- **Nhược điểm & Rủi ro**:
  - **Vi phạm DRY nặng nề**: Nhân 3 lần code quản lý state và template placeholder ở cả 3 channel.
  - Không tái sử dụng được cho `media-lightbox-modal` và `inline-composer-card`.
  - Khó bảo trì lâu dài khi đổi design system.
- **Ước tính nỗ lực**: ~1.5 giờ nhưng nợ kỹ thuật (Technical Debt) cao.

---

## Trade-off Matrix

| Tiêu chí đánh giá | Option 1: Standalone Component `<app-media-tile>` (Recommended) | Option 2: Directive `appMediaFallback` | Option 3: Inline State trong từng View |
|---|---|---|---|
| **Chất lượng UX & Tính thẩm mỹ** | **5/5** (Sạch sẽ, có skeleton, retry, thông báo rõ) | 3/5 (Chỉ đổi src SVG tĩnh, gượng gạo) | 3.5/5 (Tốt nhưng dễ lệch giao diện giữa các trang) |
| **KISS & DRY (Không lặp code)** | **5/5** (Tập trung toàn bộ 1 component) | 3.5/5 | 1/5 (Trùng lặp 3-4 view) |
| **Tương thích Angular 22 Signals** | **5/5** (Signals native, OnPush hoàn hảo) | 2/5 (Phải can thiệp Renderer2 DOM) | 4/5 |
| **Hỗ trợ cả Video & Document** | **5/5** (Nhận diện `isVideoAttachment` chuẩn) | 2.5/5 (Video thẻ HTML rất khó trị bằng directive) | 3/5 |
| **Phạm vi tác động (Blast Radius)** | Khu biệt, an toàn, dễ kiểm thử độc lập | Nguy cơ lỗi DOM injection | Rải rác khắp các controller |
| **Thời gian triển khai** | **2 - 2.5 giờ** | 2 giờ | 1.5 giờ |

---

## Final Decision & Rationale

- **Lựa chọn chính thức**: **Option 1 — Standalone Component `AppMediaTileComponent`** (kết hợp sửa triệt để thuộc tính CSS `background: #0f172a` của `.media-tile` sang màu nền trung tính `#f1f5f9` / `#f8fafc`).
- **Lý do lựa chọn**:
  1. Loại bỏ triệt để hiện tượng "khối đen/đỏ ác mộng": Kể cả khi ảnh chưa load hoặc bị lỗi, nền của tile luôn là màu xám nhạt trung tính `#f1f5f9` đồng điệu với design Figma.
  2. Bổ sung trọn vẹn placeholder chuẩn UX: Icon lỗi xám/cam nhẹ + nhãn *"Không thể tải ảnh/video"* + tên tệp đính kèm + nút *"Thử lại"*.
  3. Gom toàn bộ grid media ở `EmergencyChannelView`, `EventChannelView`, `PostCard` về 1 component duy nhất, loại bỏ hơn 150 dòng SCSS & HTML dư thừa lặp lại.
  4. Chuẩn hóa thêm cho cả phần tệp tài liệu (`.figma-file-box` / `.doc-chip`): Khi link tải file bị lỗi hoặc expired, hiển thị tooltip cảnh báo thay vì để người dùng bấm vào gặp trang trắng hoặc lỗi 403 MinIO.

---

## Implementation Strategy & Handoff Plan

### Giai đoạn 1: Tạo `AppMediaTileComponent` (`src/app/shared/media-tile/media-tile.component.ts`)
- Quản lý trạng thái: `status = signal<'loading' | 'loaded' | 'error'>('loading')`.
- Render:
  - `@if (status() === 'loading')`: Skeleton shimmer xám nhạt với hiệu ứng pulse.
  - `@if (status() === 'loaded')`: Thẻ `<img>` hoặc `<video>` hoàn chỉnh.
  - `@if (status() === 'error')`: Khối placeholder tinh tế, icon `image-x` / `alert-circle`, thông tin lỗi súc tích, nút `Thử lại`.
- Hỗ trợ badge video (`▶ Video`) và badge số lượng còn lại (`+3`).

### Giai đoạn 2: Tích hợp vào các Kênh
- `emergency-channel-view.component.html`: Thay thế vòng lặp `@for (media of mediaList)` bằng `<app-media-tile>`.
- `event-channel-view.component.html`: Đồng bộ cấu trúc media grid sang `<app-media-tile>`.
- `post-card.component.html`: Dùng `<app-media-tile>`.
- `media-lightbox-modal.component.ts`: Bổ sung fallback khi xem ảnh to trong modal mà bị lỗi link.

### Giai đoạn 3: Tinh chỉnh SCSS Base
- Xóa bỏ `background: #0f172a;` gây lỗi nền đen kịt ở các file SCSS.
- Chuyển sang biến màu nền CSS tokens: `var(--bg-media-placeholder, #f1f5f9)`.

---

## Next Steps

1. Chuyển sang kích hoạt `/cook` để hiện thực hóa `AppMediaTileComponent` và đồng bộ vào 3 kênh chính.
2. Kiểm tra trực tiếp trên trình duyệt với URL giả lập lỗi 404/403 để xác nhận placeholder hiển thị đẹp mắt, không còn khối đen/đỏ.
