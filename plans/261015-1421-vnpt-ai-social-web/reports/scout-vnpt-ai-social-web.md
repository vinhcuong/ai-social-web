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
  - `@tiptap/core` `^3.29.2` & `marked` `^16.2.0` (Rich text & Markdown rendering)
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
  - `src/app/home/component/gcn-image-preview-modal/`, `gcn-video-preview-modal/`, `gcn-file-preview-modal/`, `stm-avatar/`
  - `Dockerfile` & `build/default.conf` (Multi-stage `node:22-alpine` -> `nginxinc/nginx-unprivileged:stable-alpine`)

## 2. Domain & Figma 3.1 Specification (`STM/packages/gcn_ai_social`)

- **4 Official Channels (Desktop 2-Column Ready — `1124px` max container = `680px` main feed + `402px` right column)**:
  1. `khan` — **Thông báo khẩn** (`EmergencyChannelView`, priority filter, acknowledgment button & progress, audio/TTS summary, broadcast composer)
  2. `sukien` — **Thông tin sự kiện công ty** (`EventChannelView`, Figma 3.1 `4257:67170`, upcoming events widget, RSVP `Sẽ tham gia`/`Quan tâm`/`Không tham gia`, calendar filter, poll widget)
  3. `truyenthong` — **Truyền thông nội bộ** (`MediaChannelView`, featured post banner, category filter pills, rich media feed, reactions, threaded comments)
  4. `sotay` — **Sổ tay văn hoá** (`HandbookChannelView`, split-pane Table of Contents + embedded PDF reader + mandatory read confirmation)
- **Backend Endpoints (`ai-social-backend` `:3100`)**:
  - Auth: `POST /api/v1/auth/exchange`, `GET /api/v1/me`
  - Channels & Posts: `GET /api/v1/channels`, `GET /api/v1/channels/:code/posts`, `GET /api/v1/posts/:id`, `POST /api/v1/posts`, `PATCH /api/v1/posts/:id`, `DELETE /api/v1/posts/:id`
  - Interactions: `POST /api/v1/posts/:id/reactions`, `GET/POST /api/v1/posts/:id/comments`, `POST /api/v1/posts/:id/read-ack`, `POST /api/v1/posts/:id/share`
  - Events & Polls: `POST /api/v1/events/:id/rsvp`, `POST /api/v1/polls/:id/vote`
  - Handbook & Progress: `GET /api/v1/handbook/sections`, `GET /api/v1/stats/my-progress`, `GET /api/v1/notifications`
  - Media Upload: `POST /api/v1/media/upload-url` -> HTTP `PUT` native browser `File`/`Blob` to S3/MinIO presigned URL
  - Realtime: Socket.IO namespace `/realtime` (`post.created`, `post.updated`, `emergency.broadcast`, `reaction.updated`, `comment.created`, `poll.updated`)
