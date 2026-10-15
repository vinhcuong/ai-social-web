# VNPT AI Social Web (`ai-social-web`)

Ứng dụng Web độc lập cho **VNPT AI Social (4 Kênh thông tin chính thức)**, được xây dựng bằng **Angular 22 + TypeScript 6 + ng-zorro-antd 22 + Socket.IO v4** — đồng bộ 100% kiến trúc và quy chuẩn với **GoConnect Web (`gcn-web`)** và kết nối trực tiếp tới `ai-social-backend` (`:3100`).

## Kiến trúc tổng quan

1. **Nền tảng Công nghệ (Tech Stack đồng nhất với `gcn-web`)**:
   - **Framework**: Angular 22 (Standalone Components, Signals, `@if`/`@for`, `ChangeDetectionStrategy.OnPush`).
   - **UI & Styling**: `ng-zorro-antd 22`, SCSS/LESS theming, `AppIcon`, `CountdownTimerComponent`, `marked` (Markdown), HTML5 Video & Native PDF Viewer.
   - **Tính mô-đun (`src/app/features/ai-social/`)**: Đóng gói độc lập để vừa chạy thành cổng Web riêng (`ai-social-web`), vừa có thể gắn trực tiếp vào mục Không gian số (`/home/workspace`) của `gcn-web`.

2. **Xác thực (Authentication — Kế thừa từ `gcn-web`)**:
   - **Trình duyệt độc lập**: Đăng nhập **SĐT + OTP** qua API GoConnect (`sendOTP` / `verifyOTP`) $\rightarrow$ nhận `gcnToken` (`RS256`) $\rightarrow$ đổi sang `accessToken` nội bộ qua `POST /api/v1/auth/exchange` và tải phân quyền RBAC từ `GET /api/v1/me`.
   - **Nhúng trong WebView GoConnect**: Tự động nhận `gcnToken` từ App GoConnect qua `?gcnToken=` hoặc `window.receiveGcnToken` mà không cần nhập lại OTP.
   - **Sẵn sàng tách SSO độc lập**: Toàn bộ API nghiệp vụ chỉ dùng JWT nội bộ của AI Social, sẵn sàng chuyển đổi sang SSO VNPT (OIDC/OAuth2/CAS).

3. **4 Kênh thông tin chính thức (Figma 3.1 Desktop 2-Column Ready)**:
   - `khan` — **Thông báo khẩn**
   - `sukien` — **Thông tin sự kiện công ty**
   - `truyenthong` — **Truyền thông nội bộ**
   - `sotay` — **Sổ tay văn hoá** (tích hợp trình đọc PDF split-view chuẩn HTML5)

4. **Chia sẻ đa nền tảng & Tương tác GoConnect (`AiSocialHostBridgeService`)**:
   - **Trên trình duyệt Web độc lập**: Hộp thoại chia sẻ hỗ trợ **Sao chép liên kết (`Clipboard`)** và **Web Share API (`navigator.share`)** mở bảng chia sẻ gốc của hệ điều hành tới **Zalo, Telegram, Messenger, Mail, và GoConnect** (thông qua `receive_sharing_intent`).
   - **Khi nhúng WebView trong GoConnect**: Giao tiếp qua `JavaScriptChannel` (`window.GoConnectBridge.postMessage`) để mở trực tiếp màn hình chọn phòng chat `ReceiveSharingPage` ngay trong App GoConnect.

## Tài liệu Kế hoạch & Báo cáo (Plans & Reports)

- **Báo cáo Brainstorm Đánh giá lại Stack (Angular 22 vs Flutter Web)**: [plans/reports/brainstormer-261015-1438-vnpt-ai-social-web-stack-evaluation.md](./plans/reports/brainstormer-261015-1438-vnpt-ai-social-web-stack-evaluation.md)
- **Overview Plan**: [plans/261015-1421-vnpt-ai-social-web/plan.md](./plans/261015-1421-vnpt-ai-social-web/plan.md)
- **Phase 01 — Khởi tạo Angular 22 & Kế thừa Core từ `gcn-web`**: [phase-01-project-scaffolding-and-web-decoupling.md](./plans/261015-1421-vnpt-ai-social-web/phase-01-project-scaffolding-and-web-decoupling.md)
- **Phase 02 — Đăng nhập SĐT + OTP GoConnect & Lưu phiên**: [phase-02-goconnect-otp-auth-and-session-persistence.md](./plans/261015-1421-vnpt-ai-social-web/phase-02-goconnect-otp-auth-and-session-persistence.md)
- **Phase 03 — Khung giao diện Desktop Web Shell & 4 Kênh**: [phase-03-desktop-web-shell-and-4-channel-navigation.md](./plans/261015-1421-vnpt-ai-social-web/phase-03-desktop-web-shell-and-4-channel-navigation.md)
- **Phase 04 — Đăng bài, Upload File/Ảnh (`File`/`Blob` Stream) & Xem PDF**: [phase-04-web-composer-media-upload-and-pdf-viewer.md](./plans/261015-1421-vnpt-ai-social-web/phase-04-web-composer-media-upload-and-pdf-viewer.md)
- **Phase 05 — Chia sẻ (Copy Link + `navigator.share` + WebView JS Bridge) & Deploy**: [phase-05-sharing-webview-bridge-and-deployment.md](./plans/261015-1421-vnpt-ai-social-web/phase-05-sharing-webview-bridge-and-deployment.md)
