# Phase 01: Angular 22 Scaffolding & Core Infrastructure Reuse from `gcn-web`

## Context Links
- [Overview Plan](./plan.md)
- [Brainstorm Report: Stack Evaluation](../reports/brainstormer-261015-1438-vnpt-ai-social-web-stack-evaluation.md)
- [Scout Report: `gcn-web` & `gcn_ai_social` Inventory](./reports/scout-vnpt-ai-social-web.md)
- Reference Web Repository: `/Users/vinhcuong/Dev/gcn-web`

## Overview
- **Priority**: P1 (Foundation)
- **Current Status**: Planned
- **Effort**: 3h
- **Brief Description**: Initialize the standalone Angular 22 project at `/Users/vinhcuong/Dev/ai-social-web` matching `/Users/vinhcuong/Dev/gcn-web` (`Angular 22.0.5`, `TypeScript 6.0`, `ng-zorro-antd 22`, `socket.io-client 4.8.3`, `marked 16.2.0`), copy reusable core assets/icons/shared components from `gcn-web` and `gcn_ai_social`, and configure environment & HTTP interceptor foundations.

## Key Insights
- Aligning `/Users/vinhcuong/Dev/ai-social-web` with `/Users/vinhcuong/Dev/gcn-web`'s exact Angular 22 + `ng-zorro-antd` setup allows us to reuse `AppIcon`, `CountdownTimerComponent`, `OverlayScrollbarDirective`, `ThemeService`, `AppNotificationService`, and SCSS/LESS design tokens directly.
- Keeping all 4-channel domain logic inside `src/app/features/ai-social/` makes the feature 100% portable to `/Users/vinhcuong/Dev/gcn-web/src/app/home/` whenever needed.

## Requirements
### Functional Requirements
1. **Angular 22 Workspace Setup**:
   - Create `package.json`, `angular.json`, `tsconfig.json`, `tsconfig.app.json`, and `.stylelintrc.json` in `/Users/vinhcuong/Dev/ai-social-web` matching `gcn-web`.
   - Configure `environment.ts` and `environment.prod.ts` with:
     - `apiBaseUrl_Public_Auth`: GoConnect public auth (`https://goconnect.vnpt.vn/api/v1/public_auth` or proxy `/api/v1/auth/gcn`)
     - `aiSocialApiUrl`: `http://localhost:3100/api/v1` (prod: `/api/v1`)
     - `aiSocialSocketUrl`: `http://localhost:3100/realtime` (prod: `/realtime`)
2. **Core Shared Components & Assets Reuse**:
   - Copy SVG/PNG icons from `/Users/vinhcuong/Dev/gcn-web/src/assets/` (login, menu, file icons) + `/Users/vinhcuong/Dev/mobile-GCN-2/mobileapp/STM/packages/gcn_ai_social/assets/` (4 channel icons, reactions, badges).
   - Port `AppIcon` (`src/app/shared/icon/icon.ts`), `CountdownTimerComponent` (`src/app/shared/countdown-timer/`), `OverlayScrollbarDirective`, `AppNotificationService`, and `ThemeService` from `gcn-web`.
3. **Core Models & HTTP Interceptor**:
   - Define TypeScript interfaces in `src/app/core/models/` (`employee.model.ts`, `channel.model.ts`, `post.model.ts`, `comment.model.ts`, `event.model.ts`, `poll.model.ts`, `handbook.model.ts`).
   - Create `aiSocialAuthInterceptor` to attach `Authorization: Bearer <aiSocialAccessToken>` to `aiSocialApiUrl` requests and automatically re-exchange `gcnToken` on `401`.

### Non-Functional Requirements
- All components must be `standalone: true` with `ChangeDetectionStrategy.OnPush`.
- Every `.ts` file strictly `< 200` lines with `kebab-case` descriptive naming.
- Zero `::ng-deep` in component SCSS (use `src/styles/_overrides.scss` for global `ng-zorro` overrides).

## Architecture
```
/Users/vinhcuong/Dev/ai-social-web/
├── package.json                     # Angular 22, ng-zorro-antd 22, socket.io-client 4.8, marked
├── angular.json                     # Build & asset configuration
├── tsconfig.json
├── src/
│   ├── main.ts
│   ├── index.html
│   ├── styles.scss                  # Global styles & _overrides.scss
│   ├── assets/                      # Icons & images from gcn-web + gcn_ai_social
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   └── app/
│       ├── app.component.ts
│       ├── app.config.ts
│       ├── app.routes.ts
│       ├── core/                    # Auth, interceptors, guards, bridge, socket, models
│       ├── shared/                  # AppIcon, CountdownTimer, avatar, preview modals
│       ├── auth/                    # Phase 02: Phone + OTP Login (reused from gcn-web)
│       ├── shell/                   # Phase 03: Desktop Web Shell (Sidebar + Header)
│       └── features/
│           └── ai-social/           # Phase 03-04: 4 Channels (khan, sukien, truyenthong, sotay)
```

## Related Code Files
- **Create in `/Users/vinhcuong/Dev/ai-social-web/`**:
  - `package.json`, `angular.json`, `tsconfig.json`, `tsconfig.app.json`
  - `src/environments/environment.ts` & `src/environments/environment.prod.ts`
  - `src/app/app.config.ts`, `src/app/app.routes.ts`, `src/app/app.component.ts`
  - `src/app/shared/icon/icon.ts`
  - `src/app/shared/countdown-timer/countdown-timer.component.ts`
  - `src/app/core/models/ai-social.models.ts`
  - `src/app/core/interceptors/ai-social-auth.interceptor.ts`

## Implementation Steps
1. Initialize Angular 22 configuration (`package.json`, `angular.json`, `tsconfig.json`) in `/Users/vinhcuong/Dev/ai-social-web` and install dependencies (`npm install`).
2. Copy required icon/image assets from `gcn-web/src/assets` and `STM/packages/gcn_ai_social/assets` into `src/assets/`.
3. Port `AppIcon`, `CountdownTimerComponent`, `AppNotificationService`, and base SCSS variables/overrides from `gcn-web`.
4. Create strongly typed TypeScript interfaces for AI Social domain entities (`Channel`, `Post`, `Attachment`, `Poll`, `EventMeta`, `HandbookSection`, `EmployeeProfile`, `RbacPermissions`).
5. Configure `app.config.ts` with `provideRouter`, `provideHttpClient(withInterceptors([aiSocialAuthInterceptor]))`, `provideAnimations`, and `ng-zorro-antd` `vi_VN` locale.
6. Run `npm run build` to verify clean compilation.

## Todo List
- [ ] Create Angular 22 project config (`package.json`, `angular.json`, `tsconfig.json`)
- [ ] Copy shared icons & assets from `gcn-web` and `gcn_ai_social`
- [ ] Port `AppIcon`, `CountdownTimerComponent`, and `AppNotificationService`
- [ ] Define TypeScript domain models (`src/app/core/models/`)
- [ ] Verify `npm run build` succeeds with 0 errors

## Success Criteria
- `npm run build` compiles cleanly with 0 TypeScript or template errors.
- All shared icons and `ng-zorro-antd` components render properly.

## Risk Assessment
- **Node/Angular CLI Compatibility**: Reuse exact dependency versions and `overrides` (`@babel/core`, `esbuild`, `uuid`) proven in `/Users/vinhcuong/Dev/gcn-web/package.json`.

## Security Considerations
- No hardcoded tokens or credentials in `environment.ts`; enforce `HttpClient` interceptor only on configured API origins.

## Next Steps
- Proceed to [Phase 02: GoConnect Phone+OTP Auth, Token Exchange & WebView Auto-Login](./phase-02-goconnect-otp-auth-and-session-persistence.md).
