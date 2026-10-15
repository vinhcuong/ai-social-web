# Scout Report: VNPT AI Social Web (`ai-social-web` + `gcn-web`)

**Date**: 2026-10-15  
**Target Directory**: `/Users/vinhcuong/Dev/ai-social-web`  
**Reference Web Repository**: `/Users/vinhcuong/Dev/gcn-web` (Angular 22 + ng-zorro-antd 22)  
**Reference Domain/UI Specification**: `/Users/vinhcuong/Dev/mobile-GCN-2/mobileapp/STM/packages/gcn_ai_social`  
**Backend Repository**: `/Users/vinhcuong/Dev/ai-social-backend`

## 1. Reusable Web Infrastructure in `/Users/vinhcuong/Dev/gcn-web`

- **Tech Stack (`package.json`)**:
  - Angular `^22.0.5` (Standalone components, Signals, `@if`/`@for` control flow, `ChangeDetectionStrategy.OnPush`)
  - `ng-zorro-antd` `^22.0.1`, `@angular/cdk` `^22.0.3`, Bootstrap 5 utility classes, SCSS + LESS theming
  - `socket.io-client` `^4.8.3` & `ngx-socket-io` `^4.10.0`
  - `marked` `^16.2.0` (Markdown rendering)
  - `luxon` `^2.5.0`, `dayjs` `^1.11.13`, `@ngx-translate/core` `^14.0.0`
- **Auth & Session Files Ready to Reuse (Phone + OTP)**:
  - `src/app/auth/login/login.component.ts` & `.html` / `.scss` (`sendOtp`, phone validation `PHONENUMBER_REGEX`, 120s OTP cooldown)
  - `src/app/auth/login/otp-auth/otp-auth.component.ts` & `.html` / `.scss` (`verifyOtp`, masked phone number, `CountdownTimerComponent`)
  - `src/app/services/auth-session.service.ts` (`AuthSessionService` — Signal-based token & expiry persistence in `localStorage`)
  - `src/app/guards/auth.guard.ts` & `redirect-if-logged-in.guard.ts`
- **Shared UI Components & Services in `gcn-web`**:
  - `src/app/shared/icon/icon.ts` (`AppIcon` SVG mask/image icon system)
  - `src/app/shared/countdown-timer/countdown-timer.component.ts`
  - `src/app/shared/overlay-scrollbar/overlay-scrollbar.directive.ts`
  - `src/app/services/app-notification.service.ts` & `src/app/theme.service.ts`
  - `Dockerfile` & `build/default.conf` (Multi-stage `node:22-alpine` -> `nginxinc/nginx-unprivileged:stable-alpine`)

## 2. Domain & Figma 3.1 Specification (`STM/packages/gcn_ai_social`)

- **4 Official Channels (Desktop 2-Column Ready — `1124px` max container = `680px` main feed + `402px` right column)**:
  1. `khan` — **Thông báo khẩn**
  2. `sukien` — **Thông tin sự kiện công ty** (Figma 3.1 `4257:67170`)
  3. `truyenthong` — **Truyền thông nội bộ**
  4. `sotay` — **Sổ tay văn hoá** (split-pane Table of Contents + embedded PDF reader)
