# Research Summary Report: VNPT AI Social Web (`ai-social-web` — Angular 22)

**Date**: 2026-10-15  
**Target Workspace**: `/Users/vinhcuong/Dev/ai-social-web`  
**Reference Web Repo**: `/Users/vinhcuong/Dev/gcn-web`

## 1. Executive Summary
- **Tech Stack**: **Angular 22 + TypeScript 6 + ng-zorro-antd 22 + Socket.IO v4**, matching `/Users/vinhcuong/Dev/gcn-web` 100%.
- **Authentication**: Reuses `gcn-web`'s **Phone + OTP** flow (`sendOTP` + `verifyOTP` with 120s `CountdownTimerComponent`) -> exchanges `gcnToken` with `ai-social-backend` (`POST /api/v1/auth/exchange` + `GET /api/v1/me`). Supports zero-click WebView auto-login via `?gcnToken=` or `window.receiveGcnToken`.
- **Sharing & Host Bridge**: Implements `AiSocialHostBridgeService` supporting **Copy Link (`navigator.clipboard`)**, **Web Share API (`navigator.share` to Zalo, Telegram, GoConnect on mobile)**, and **Embedded GoConnect WebView Bridge (`window.GoConnectBridge.postMessage`)**.
- **Media Upload & PDF**: Uses native browser `File`/`Blob` streaming for S3 presigned `PUT` uploads (zero WASM memory overhead) and native HTML5 PDF/Video rendering.

## 2. Detailed Reports
- [Brainstorm Report: Stack Evaluation (Why Angular 22 over Flutter Web)](./brainstormer-261015-1438-vnpt-ai-social-web-stack-evaluation.md)
- [Research 01: Auth, Token Exchange & SSO Readiness](../261015-1421-vnpt-ai-social-web/research/researcher-01-auth-sso-and-backend-integration.md)
- [Research 02: Angular 22 Architecture, `gcn-web` Reuse & Host Bridge](../261015-1421-vnpt-ai-social-web/research/researcher-02-flutter-web-port-and-host-bridge.md)
