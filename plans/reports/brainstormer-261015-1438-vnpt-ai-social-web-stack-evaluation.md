---
title: "Brainstorm: Re-evaluating VNPT AI Social Web Stack (Rejecting Flutter Web in favor of Angular 22 / gcn-web Alignment)"
description: "Critical audit of the existing Flutter Web plan against /Users/vinhcuong/Dev/gcn-web and consensus decision to build ai-social-web with Angular 22 + ng-zorro-antd."
status: decided
topic: "vnpt-ai-social-web-stack-evaluation"
chosen_option: "Option A: Standalone Angular 22 + ng-zorro-antd at /Users/vinhcuong/Dev/ai-social-web (Reusing gcn-web Auth/Shared)"
date: 2026-10-15
tags: [angular-22, gcn-web, flutter-web-audit, ai-social-web, architecture]
---

# Brainstorm Report: Đánh Giá Lại Plan `ai-social-web` & Đối Chiếu Với `gcn-web`

## Executive Summary
Plan ban đầu (`plans/261015-1421-vnpt-ai-social-web`) định hướng dùng **Flutter Web** bằng cách copy 142 file Dart từ mobile sang `/Users/vinhcuong/Dev/ai-social-web`. Qua kiểm tra thực tế và đối chiếu với `/Users/vinhcuong/Dev/gcn-web` (**Angular 22 + TypeScript 6 + ng-zorro-antd 22**), hướng đi Flutter Web đã bị loại bỏ do hạn chế của CanvasKit/WASM trên trình duyệt và lệch chuẩn công nghệ với `gcn-web`. Quyết định cuối cùng là xây dựng `/Users/vinhcuong/Dev/ai-social-web` bằng **Angular 22 + ng-zorro-antd 22** kế thừa nền tảng từ `gcn-web`, giữ luồng đăng nhập **SĐT + OTP** (`sendOTP`/`verifyOTP`) và cơ chế chia sẻ **Copy link + Web Share API (`navigator.share`) + WebView JS Bridge (`window.GoConnectBridge`)**.

---

## 1. Đánh Giá Thực Tế Plan Cũ (Tại Sao Bỏ Flutter Web)

| # | Điểm yếu trong Plan cũ (Flutter Web) | Giải pháp khắc phục với Angular 22 (`gcn-web` stack) |
|---|---|---|
| **1** | **Render bằng `<canvas>` (CanvasKit/WASM)** gây lỗi bôi đen/copy tiếng Việt, mất `Ctrl+F`, nặng 4–6MB khi mở link chia sẻ `/r/p/:postId`. | **Native HTML DOM (Angular 22)**: Bundle nhẹ (~200KB gzipped), bôi đen/copy văn bản, `Ctrl+F`, SEO/OpenGraph và cuộn trang mượt 60/120fps. |
| **2** | **Lỗi `HtmlElementView` (Iframe PDF / Video)** gây đè z-index lên popup/modal và giật lag khi cuộn feed. | **HTML5 `<video>`, `<iframe>` / PDF viewer chuẩn DOM**: Tái sử dụng các modal preview từ `gcn-web` (`gcn-image-preview-modal`, `gcn-video-preview-modal`, `gcn-file-preview-modal`). |
| **3** | **Tràn RAM khi upload file qua `Uint8List` (Phase 04)** do nạp cả file Video 100MB / PDF 50MB vào bộ nhớ Dart WASM. | **Native Browser `File` / `Blob` Stream**: Upload qua `HttpClient` / `fetch` `PUT` trực tiếp lên S3 presigned URL với ~0MB RAM phụ trội. |
| **4** | **Phân mảnh Tech Stack & Nhân đôi bảo trì** giữa Web (`gcn-web` dùng Angular 22) và bản fork 142 file Dart. | **Đồng nhất 100% Angular 22 + ng-zorro-antd 22**: Tái sử dụng `AuthSessionService`, `CountdownTimerComponent`, `AppIcon`, `ThemeService` từ `gcn-web` và dễ dàng nhúng ngược module `ai-social` vào `gcn-web` (`/home/workspace`) khi cần. |

---

## 2. Quyết Định Kiến Trúc Đã Chốt (Final Decision)

1. **Kiến trúc & Tech Stack (Option A)**:
   - Xây dựng ứng dụng độc lập tại `/Users/vinhcuong/Dev/ai-social-web` bằng **Angular 22 (Standalone Components, Signals, `@if`/`@for` control flow) + TypeScript 6 + ng-zorro-antd 22 + Socket.IO v4 + SCSS/LESS** — tuân thủ 100% coding rules của `/Users/vinhcuong/Dev/gcn-web/GEMINI.md`.
   - Đóng gói toàn bộ tính năng 4 kênh (`khan`, `sukien`, `truyenthong`, `sotay`) trong `src/app/features/ai-social/` để vừa chạy độc lập tại `ai-social-web`, vừa có thể gắn trực tiếp vào `gcn-web/src/app/home/workspace` mà không cần viết lại.
2. **Cơ chế Đăng nhập (Auth — KISS & YAGNI)**:
   - Chỉ lấy luồng **SĐT + OTP** (`sendOTP` + `verifyOTP` kế thừa từ `LoginComponent` & `OtpAuthComponent` của `gcn-web`, kèm `CountdownTimerComponent` 120s).
   - Sau khi `verifyOTP` trả về `token` (`gcnToken` RS256) và `refreshToken`, tự động gọi `POST /api/v1/auth/exchange` + `GET /api/v1/me` sang `ai-social-backend` (`:3100`) để lấy `accessToken` nội bộ (15m) và quyền RBAC.
   - Hỗ trợ tự động đăng nhập khi nhúng trong GoConnect Mobile WebView qua `?gcnToken=` hoặc `window.receiveGcnToken`.
3. **Cơ chế Chia sẻ (Sharing & Host Bridge)**:
   - Giữ gọn nhẹ theo đúng yêu cầu: **Copy link + Web Share API (`navigator.share`) + GoConnect WebView JS Bridge (`window.GoConnectBridge.postMessage`)**.

---

## 3. Next Steps & Handoff
1. [x] Cập nhật toàn bộ bộ Plan tại `/Users/vinhcuong/Dev/ai-social-web/plans/261015-1421-vnpt-ai-social-web/` sang kiến trúc **Angular 22 + ng-zorro-antd 22**.
2. [ ] Chuyển sang `/cook` để triển khai từ Phase 01.
