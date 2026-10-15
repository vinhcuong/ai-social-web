# Research 01: GoConnect OTP Auth, Token Exchange & Standalone SSO Readiness

**Date**: 2026-10-15  
**Target Project**: `/Users/vinhcuong/Dev/ai-social-web`  
**Backend**: `/Users/vinhcuong/Dev/ai-social-backend` (`http://localhost:3100`)

## 1. GoConnect Public OTP Authentication Flow

Web client authenticates users using existing GoConnect production endpoints:

### 1.1. Request OTP (`sendOTP`)
- **Endpoint**: `POST https://goconnect.vnpt.vn/api/v1/public_auth/users/sendOTP`
- **Payload**:
  ```json
  {
    "phoneNumber": "0879257827",
    "appSignature": ""
  }
  ```
- **Response**: Standard `BaseResponse` confirming OTP dispatch to the user's phone/app.

### 1.2. Verify OTP (`verifyOTP`)
- **Endpoint**: `POST https://goconnect.vnpt.vn/api/v1/public_auth/users/verifyOTP`
- **Payload**:
  ```json
  {
    "phoneNumber": "0879257827",
    "otp": "123456",
    "hasAcceptTerms": true
  }
  ```
- **Response (`LoginEntity` flat JSON)**:
  - `user`: `{ user_id, user_code ("VNPT033136"), user_firstName, user_middleName, user_lastName, user_phoneNumber, user_email, user_avatar, user_avatar_thumb, user_cus_id }`
  - `account`: `{ acc_id, user_id, acc_phoneNumber, acc_status, acc_has_accept_terms }`
  - `token`: GoConnect `RS256` JWT (valid 30 days; payload contains `userId`, `accountId`, `phoneNumber`, `email`, `code`, `firstName`, `lastName`, `middleName`, `custId`).
  - `refreshToken`: GoConnect `RS256` refresh JWT (valid 365 days).

### 1.3. Browser CORS Consideration & Backend Proxy Option
- Direct browser XHR calls from `http://localhost:*` or `https://social.vnpt.vn` to `https://goconnect.vnpt.vn` may be blocked if `goconnect.vnpt.vn` restricts `Access-Control-Allow-Origin`.
- **Mitigation**: Add lightweight passthrough proxy endpoints on `ai-social-backend` (`POST /api/v1/auth/gcn/send-otp`, `POST /api/v1/auth/gcn/verify-otp`, `POST /api/v1/auth/gcn/refresh`) or Nginx reverse proxy `/gcn-auth/* -> https://goconnect.vnpt.vn/api/v1/public_auth/*`.

## 2. AI Social Token Exchange & Session Lifecycle

1. **Token Exchange (`POST /api/v1/auth/exchange`)**:
   - Request: `{ "gcnToken": "<verifyOTP.token>" }`
   - Backend decodes `code` (`VNPT033136`) / `email`, matches against PostgreSQL `employees` table (308 synced employees, 5,693 units), and issues internal `HS256` `accessToken` (TTL 900s / 15m).
2. **RBAC & Profile Hydration (`GET /api/v1/me`)**:
   - Returns `employee` + `permissions` (`roles`, `publisherChannels`, `canBroadcastEmergency`).
   - Avatar URL from `verifyOTP.user.user_avatar_thumb` is cached in browser storage and optionally synced to `employees.avatar_url` during exchange.
3. **Silent Token Renewal**:
   - When `accessToken` expires (15m), Dio interceptor re-invokes `POST /api/v1/auth/exchange` using cached `gcnToken` in `localStorage`.
   - When `gcnToken` nears expiry (30d), client calls `/api/v1/public_auth/users/token` with `refreshToken`.
4. **WebView Auto-Login**:
   - When loaded inside GoConnect Mobile WebView, host passes `gcnToken` via query/hash or `window.receiveGcnToken(token)` -> skips OTP screen and exchanges immediately.

## 3. Standalone VNPT SSO Readiness (Future-Proofing)

- `ai-social-backend` decouples external IdP verification inside `TokenExchangeService` (`apps/api/src/auth/services/token-exchange.service.ts`).
- All domain controllers (`posts`, `channels`, `handbook`, `polls`, `events`, `stats`, `rbac`, `org`, `media`) and Socket.IO (`/realtime`) only validate internal AI Social JWT via `JwtAuthGuard`.
- Transitioning to standalone VNPT SSO (OIDC/OAuth2/CAS) only requires adding `/api/v1/auth/sso/callback` and `RefreshToken` table without altering any feature API or frontend screen.

## Unresolved Questions
- Will production `social.vnpt.vn` use Nginx reverse proxy for `/gcn-auth` or backend NestJS proxy endpoints to avoid browser CORS on `goconnect.vnpt.vn`?
