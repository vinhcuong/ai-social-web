# Phase 03: Desktop Web Shell, 4-Channel Views (`khan`, `sukien`, `truyenthong`, `sotay`) & Deep-Link Routing

## Context Links
- [Overview Plan](./plan.md)
- [Phase 02: GoConnect Phone+OTP Auth](./phase-02-goconnect-otp-auth-and-session-persistence.md)
- Reference Mobile Views (Figma 3.1 Desktop 2-Column Specs):
  - `/Users/vinhcuong/Dev/mobile-GCN-2/mobileapp/STM/packages/gcn_ai_social/lib/src/presentation/views/emergency_channel_view.dart`
  - `/Users/vinhcuong/Dev/mobile-GCN-2/mobileapp/STM/packages/gcn_ai_social/lib/src/presentation/views/event_channel_view.dart`
  - `/Users/vinhcuong/Dev/mobile-GCN-2/mobileapp/STM/packages/gcn_ai_social/lib/src/presentation/views/media_channel_view.dart`
  - `/Users/vinhcuong/Dev/mobile-GCN-2/mobileapp/STM/packages/gcn_ai_social/lib/src/presentation/views/handbook_channel_view.dart`
- Reference `gcn-web` Layout: `/Users/vinhcuong/Dev/gcn-web/src/app/home/menu-bar/menu-bar.component.ts`

## Overview
- **Priority**: P1 (Core UI & Feed Views)
- **Current Status**: Planned
- **Effort**: 5h
- **Brief Description**: Build the responsive `AiSocialShellComponent` (Left Sidebar + Top Header + Emergency Alert Banner + Notification Popover) and implement the 4 Official Channel Views (`khan`, `sukien`, `truyenthong`, `sotay`) in `src/app/features/ai-social/` following the exact Figma 3.1 2-column desktop design (`680px` main feed + `402px` right sidebar) and Socket.IO `/realtime` live updates.

## Key Insights
- Building the 4 channel views as standalone Angular 22 components inside `src/app/features/ai-social/` gives native HTML DOM text selection, `Ctrl+F`, fast scrolling, and allows mounting the exact same components inside `/Users/vinhcuong/Dev/gcn-web/src/app/home/workspace/` later.
- `AiSocialSocketService` connects to `ai-social-backend`'s `/realtime` namespace and updates Angular Signals in real time (`post.created`, `post.updated`, `emergency.broadcast`, `reaction.updated`, `comment.created`, `poll.updated`).

## Requirements
### Functional Requirements
1. **Desktop Web Shell (`src/app/shell/`)**:
   - `WebSidebarNavComponent` (`260px` on desktop `>= 1024px`, drawer on mobile `< 1024px`):
     - VNPT AI Social brand header.
     - 4 Channel Navigation Items with live unread badges:
       - `Thông báo khẩn` (`/channels/khan`)
       - `Thông tin sự kiện` (`/channels/sukien`)
       - `Truyền thông nội bộ` (`/channels/truyenthong`)
       - `Sổ tay văn hoá` (`/channels/sotay`)
     - Mandatory reading progress card (`MyProgressCardComponent` — `GET /api/v1/stats/my-progress`).
     - User profile footer (`avatar`, `fullName`, `employeeCode`, `unitName`, role badge, Logout button).
   - `WebTopHeaderComponent`:
     - Channel title, search/filter bar, active Emergency Broadcast banner, and In-App Notification bell popover (`GET /api/v1/notifications`).
2. **4 Official Channel Views (`src/app/features/ai-social/views/`)**:
   - **2-Column Desktop Layout (`1124px` max width = `680px` left feed + `24px` gap + `402px` right column)**:
     - `EmergencyChannelComponent` (`khan`): Priority badges, mandatory acknowledgment button (`Tôi đã đọc và nắm rõ thông tin` -> `POST /api/v1/posts/:id/read-ack`), ack progress bar, TTS audio player, right-column emergency guideline & stats card.
     - `EventChannelComponent` (`sukien` — Figma 3.1 `4257:67170`): Event banner, date/time/location metadata, RSVP buttons (`Sẽ tham gia` / `Quan tâm` / `Không tham gia` -> `POST /api/v1/events/:id/rsvp`), right-column Upcoming Events calendar & Poll cards.
     - `MediaChannelComponent` (`truyenthong`): Featured news hero card, category filter chips, post cards with Markdown (`marked`), media gallery grid, reactions (`LIKE`/`LOVE`/`CLAP`), and threaded comments drawer/section.
     - `HandbookChannelComponent` (`sotay`): Split-pane layout — Left pane: searchable Table of Contents (`GET /api/v1/handbook/sections`) with read/unread checkmarks; Right pane: native PDF viewer + `Xác nhận đã đọc` button.
3. **Deep-Link Routing (`app.routes.ts`)**:
   - `/channels/:code` -> `AiSocialShellComponent` -> active channel view.
   - `/posts/:postId` and `/r/p/:postId` -> `PostDetailPageComponent` (supports unauthenticated redirect to `/login?redirect=/r/p/:postId`).

### Non-Functional Requirements
- Strictly `< 200` lines per `.ts` file; decompose into Smart container views and Dumb presentational cards.
- Native DOM text selection and responsive breakpoints (`< 768px` 1-column, `>= 1024px` 2-column feed + sidebar).

## Architecture
```
src/app/features/ai-social/
├── services/
│   ├── ai-social-api.service.ts        # REST calls to ai-social-backend
│   ├── ai-social-state.service.ts      # Signal-based state for channels, posts, badges
│   └── ai-social-socket.service.ts     # Socket.IO /realtime listener
├── views/
│   ├── emergency-channel/              # Kênh Thông báo khẩn (khan)
│   ├── event-channel/                  # Kênh Sự kiện công ty (sukien)
│   ├── media-channel/                  # Kênh Truyền thông nội bộ (truyenthong)
│   ├── handbook-channel/               # Kênh Sổ tay văn hoá (sotay)
│   └── post-detail/                    # Deep-link post detail (/r/p/:postId)
└── components/
    ├── post-card/                      # Header, body (Markdown), media grid, footer actions
    ├── post-comments/                  # Threaded comments list & input
    ├── event-rsvp-card/                # RSVP status & upcoming events sidebar widget
    ├── poll-card/                      # Interactive poll voting & progress bars
    └── emergency-ack-banner/           # Mandatory read-ack button & counter
```

## Related Code Files
- **Create in `/Users/vinhcuong/Dev/ai-social-web/src/app/`**:
  - `shell/ai-social-shell.component.ts`, `shell/web-sidebar-nav/web-sidebar-nav.component.ts`, `shell/web-top-header/web-top-header.component.ts`
  - `features/ai-social/services/ai-social-api.service.ts`
  - `features/ai-social/services/ai-social-state.service.ts`
  - `features/ai-social/services/ai-social-socket.service.ts`
  - `features/ai-social/views/emergency-channel/emergency-channel.component.ts`
  - `features/ai-social/views/event-channel/event-channel.component.ts`
  - `features/ai-social/views/media-channel/media-channel.component.ts`
  - `features/ai-social/views/handbook-channel/handbook-channel.component.ts`
  - `features/ai-social/views/post-detail/post-detail.component.ts`
  - `features/ai-social/components/post-card/post-card.component.ts`
  - `features/ai-social/components/post-comments/post-comments.component.ts`
  - `features/ai-social/components/poll-card/poll-card.component.ts`

## Implementation Steps
1. Implement `AiSocialApiService`, `AiSocialStateService` (Signals), and `AiSocialSocketService` (`/realtime`).
2. Build `AiSocialShellComponent` with `WebSidebarNavComponent` (4 channels + unread badges + user profile) and `WebTopHeaderComponent` (emergency alert + notification popover).
3. Build reusable `PostCardComponent`, `PostCommentsComponent`, `PollCardComponent`, and `EventRsvpCardComponent`.
4. Build the 4 channel views (`EmergencyChannelComponent`, `EventChannelComponent`, `MediaChannelComponent`, `HandbookChannelComponent`) with Figma 3.1 2-column desktop layouts.
5. Configure `/channels/:code`, `/posts/:postId`, and `/r/p/:postId` routes.

## Todo List
- [ ] Implement `AiSocialApiService`, `AiSocialStateService`, and `AiSocialSocketService`
- [ ] Build `AiSocialShellComponent` (`WebSidebarNavComponent` + `WebTopHeaderComponent`)
- [ ] Build `PostCardComponent`, `PostCommentsComponent`, and `PollCardComponent`
- [ ] Build `EmergencyChannelComponent` (`khan`) & `EventChannelComponent` (`sukien`)
- [ ] Build `MediaChannelComponent` (`truyenthong`) & `HandbookChannelComponent` (`sotay`)
- [ ] Wire deep-link route `/r/p/:postId` (`PostDetailComponent`)

## Success Criteria
- Switching between `/channels/khan`, `/channels/sukien`, `/channels/truyenthong`, and `/channels/sotay` renders the 2-column desktop layout and live data from `ai-social-backend`.
- Reactions, comments, read-acknowledgments, RSVP, and poll votes update immediately in UI and via Socket.IO.

## Risk Assessment
- **XSS in Markdown Rendering**: Sanitize HTML output from `marked` using Angular's `DomSanitizer` before binding.

## Security Considerations
- Hide publisher/admin action menus unless `AiSocialAuthService.canPublishInChannel(channelCode)` is true.

## Next Steps
- Proceed to [Phase 04: Web Composer, Native `File`/`Blob` S3 Upload, Polls/Events & Split-Pane PDF Viewer](./phase-04-web-composer-media-upload-and-pdf-viewer.md).
