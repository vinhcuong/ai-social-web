# Research 02: Angular 22 Architecture, `gcn-web` Reuse & Multi-Mode Host Bridge

**Date**: 2026-10-15  
**Target Project**: `/Users/vinhcuong/Dev/ai-social-web`  
**Reference Web Repo**: `/Users/vinhcuong/Dev/gcn-web` (`vnpt-goconnect-web`)  
**Reference Domain Specs**: `STM/packages/gcn_ai_social`

## 1. Why Angular 22 (Aligned with `gcn-web`) Over Flutter Web

1. **100% Ecosystem & Codebase Cohesion**:
   - `/Users/vinhcuong/Dev/gcn-web` is built on **Angular 22.0.5 + TypeScript 6.0 + ng-zorro-antd 22.0.1 + SCSS/LESS**.
   - Building `ai-social-web` with the exact same Angular 22 architecture allows direct reuse of `gcn-web`'s Phone+OTP login components, `AuthSessionService`, `ThemeService`, `AppIcon`, and media modals.
   - Furthermore, placing the 4-channel feature inside `src/app/features/ai-social/` makes it 100% plug-and-play if the team later wants to mount it inside `gcn-web`'s `/home/workspace` (`WorkspaceLayoutComponent`).
2. **Native HTML DOM Advantages**:
   - Fast First Contentful Paint (~200KB gzipped vs 5MB Flutter CanvasKit).
   - Native Vietnamese text selection, copy-paste, browser `Ctrl+F`, and SEO/OpenGraph support.
   - Zero-RAM streaming upload: `<input type="file">` produces a native `File` (`Blob`) streamed directly via `HttpClient.put(uploadUrl, file)` to S3/MinIO presigned URLs without loading 100MB `Uint8List` buffers into WASM memory.
   - Native PDF viewing (`<iframe>` / `<object>` with browser PDF viewer) and HTML5 `<video>` without Flutter `HtmlElementView` z-index bugs.

## 2. Coding Standards Inherited from `gcn-web/GEMINI.md`

- **Standalone Components Only**: Every component sets `standalone: true` and `changeDetection: ChangeDetectionStrategy.OnPush`.
- **Angular 22 Signals & Control Flow**:
  - Use `signal()`, `computed()`, `effect()`, `input()`, `output()`, `model()` for UI state.
  - Use `@if`, `@for (...; track ...)`, `@switch` in templates. Never call functions inside template interpolations `{{ }}`.
- **File Size & Modularization**:
  - Keep every code file `< 200` lines with `kebab-case` descriptive file names.
  - Separate Smart (Container) components from Dumb (Presentational) components.
- **Styling**:
  - Component-scoped SCSS; never use `::ng-deep` (place global Ant Design overrides in `src/styles/_overrides.scss`).

## 3. Multi-Environment Sharing & GoConnect WebView Bridge (`AiSocialHostBridgeService`)

`AiSocialHostBridgeService` provides a unified API for both standalone browsers and embedded GoConnect Mobile WebView:

| Action | Mode A: Standalone Web Browser (Chrome/Safari/Edge) | Mode B: Embedded inside GoConnect WebView |
|---|---|---|
| **Auth Token** | Read `gcnToken` from `localStorage` (obtained via `sendOTP`/`verifyOTP`), exchange for internal `aiSocialAccessToken` (15m TTL) | Receive `gcnToken` from `?gcnToken=` URL param or `window.receiveGcnToken(token)` -> skip OTP screen and exchange immediately |
| **Share to GoConnect / External (`sharePost`)** | Offer **Sao chép liên kết** (`navigator.clipboard.writeText`) + **Chia sẻ qua ứng dụng** (`navigator.share({ title, text, url })` -> OS Share Sheet lists **Zalo**, **Telegram**, and **GoConnect** on mobile via `receive_sharing_intent`) | Call `window.GoConnectBridge.postMessage(JSON.stringify({ action: 'openChatForward', title, permalink, channelCode }))` -> opens native `ReceiveSharingPage.show(...)` inside GoConnect App |
| **Open File (`openFileViewer`)** | Open in in-app preview modal (`GcnFilePreviewModal` / PDF split view) or `window.open(fileUrl, '_blank')` | Delegate to `window.GoConnectBridge` or open in modal/`_blank` |
