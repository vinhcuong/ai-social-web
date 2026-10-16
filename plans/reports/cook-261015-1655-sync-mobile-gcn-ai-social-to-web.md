# Cook Report — Synchronize Mobile `gcn_ai_social` UI, Features & APIs to Web (`ai-social-web`)

- **Date**: 2026-10-15
- **Project**: `/Users/vinhcuong/Dev/ai-social-web`
- **Reference Sources**:
  - Figma `3987:126348` (`4818:54017`, `4818:54021`, `4818:54058`, `4818:54126`)
  - Mobile Package `/Users/vinhcuong/Dev/mobile-GCN-2/mobileapp/STM/packages/gcn_ai_social`
- **Scope Boundary**: Focused 100% on the **VNPT AI Social** module (`gcn_ai_social`). Excluded GoConnect's general "Không gian số" app-launcher features (`Tất cả ứng dụng`, `Không gian tùy biến`, app groups, mail config).

---

## 1. Summary of Implemented Features

### Phase 01 — Assets, Models, Seed Fallback & Full REST/Realtime API Synchronization
- **Assets Synced (`src/assets/ai-social/` & `src/assets/ai-social/home/`)**:
  - Downloaded 16 2x PNG & SVG Home assets from Figma (`bg-hong.png`, `bg-vang.png`, `bg-tim.png`, `bg-xanh.png`, `thong-bao-khan.png`, `thong-tin-su-kien.png`, `truyen-thong-noi-bo.png`, `so-tay-van-hoa.png`, `tin-khan.png`, `lich-sap-toi-3d.png`, `ic-notification-bubble.svg`, `ic-arrow-right.svg`, `ic-calendar-upcoming-box.svg`, `ic-dot-red.svg`, `ic-dot-amber.svg`).
  - Synced mobile channel assets (`tin-thuong.png`, `composer_ai_avatar.svg`, `composer_pin.svg`, `ic_broadcasting.svg`, `share-03.svg`, `link-04.svg`, `download-04.svg`, `file-pdf.svg`, `so_tay_van_hoa.pdf`).
- **Models & Seed Data**:
  - Created `src/app/core/models/ai-social-extended.models.ts` (`SyncResponse`, `DraftListResponse`, `PostUnitBreakdownResponse`, `PostRecipientsResponse`, `RemindResponse`, `EventRegistrationSummaryModel`, `EventDepartmentStatItem`, `UpcomingScheduleDayGroup`).
  - Created `src/app/features/ai-social/services/ai-social-seed-posts.data.ts` and `src/app/features/ai-social/services/ai-social-seed-meta.data.ts` with realistic VNPT AI Social fallback data matching the Figma and mobile screens.
- **API & Auth Services**:
  - Updated `src/app/features/ai-social/services/ai-social-api.service.ts` to cover all mobile `IAiSocialApi` endpoints (`/badges`, `/sync`, `/me/progress`, `/channels/:code/posts`, `/channels/:code/categories`, `/posts/:id/acknowledge`, `/posts/:id/end-broadcast`, `/posts/:id/recipients/summary`, `/posts/:id/recipients/units`, `/posts/:id/recipients`, `/posts/:id/remind`, `/events/:postId/register`, `/events/:postId/registrations/summary`, `/events/:postId/registrations/units`, `/events/:postId/remind-registration`, `/channels/sotay/toc`, `/handbook/pdf/bookmarks`, etc.) with automatic fallback to seed data when `:3100` is unreachable.
  - Added 1-click **Demo Mode** (`enterDemoMode()`) in `src/app/auth/login/login.component.ts` and `src/app/core/services/ai-social-auth.service.ts`.

### Phase 02 — Home AI Social Screen (`/home`)
- Created `src/app/features/ai-social/views/home-page/ai-social-home-page.component.ts` (`.html`, `.scss`):
  - **4 Pinned Channel Cards (`288×190px`, `r=12px`)**: `Thông báo khẩn` (`khan`), `Thông tin sự kiện` (`sukien`), `Truyền thông nội bộ` (`truyenthong`), `Sổ tay văn hoá` (`sotay`) with 2x 3D icons, pastel wave backgrounds, and `Tag / Colorful` badge pills (`• 2 chưa đọc`, `• 3 tin mới`, `1 bài bắt buộc`).
  - **Active Emergency Alert Banner (`#FEF4F4`)**: Displays `tin-khan.png` (`60×60px`), active emergency title, action summary, and `"Chi tiết →"` deep-link to `/channels/khan?highlightId=<post.id>`.
  - **Upcoming Schedule Card (`"LỊCH SẮP TỚI"`, `587px`)**: Header with `#F0F6FF` calendar icon box, `"Quản trị"` purple pill, floating 3D `lich-sap-toi-3d.png` (`top: -8px; right: 33px`), and `#F0F6FF` container with white day-group rows (`border-left: 4px solid #5C9AFF`) and colored category dots.

### Phase 03 & 04 — 4 Specialized Channel Views & 3-Tier Reminder Modal
- **`/channels/khan` (`EmergencyChannelViewComponent`)**:
  - Centered `680px` column, `InlineComposerCardComponent(channelCode: 'khan')`, and `EmergencyPostCard` with `EmergencyPostHeader` (`ĐANG PHÁT` / `ĐÃ KẾT THÚC`, `# An toàn thông tin`, `Chia sẻ`, `Copy link`, `Kết thúc phát`), `EmergencyEndNoteBox`, 4-row `#F8F8F8` `EmergencyInfoTable` (`Hiện trạng`, `Cần làm ngay`, `Người nhận`, `Đính kèm`), and `EmergencyPostFooter` (`X / Y đã đọc • Danh sách chi tiết` + `"Tôi đã đọc & Nắm rõ"`).
- **`/channels/sukien` (`EventChannelViewComponent` + `EventSidebarCalendarComponent`)**:
  - Top header + 5-tab `EventFilterTabsBar` (`Tất cả`, `Sự kiện`, `Thông báo`, `Đào tạo nội bộ`, `Lịch nghỉ`).
  - 2-column layout (`680px` feed + `402px` calendar sidebar):
    - Left feed: Search bar, active date filter chip, `InlineComposerCardComponent(channelCode: 'sukien')`, and `EventPostCard` list with `MinorEditCalloutBox`, `📅 Thời gian / 📍 Địa điểm / 👉 Link tham dự`, and 2-tier footer (`Đăng ký ngay` / `✓ Đã đăng ký (Hủy)` + `Danh sách chi tiết`).
    - Right sidebar: `EventMonthCalendarCard` (interactive month grid with colored dots & 4 legends), `EventMonthlyScheduleCard` (`"LỊCH SỰ KIỆN THÁNG X"`), and `EventYearHeatmapWidget` (`"Tổng quan sự kiện Năm 2026"`).
- **`/channels/truyenthong` (`MediaChannelViewComponent`)**:
  - Dismissible `MediaCampaignHeroBanner` (`CHIẾN DỊCH NỔI BẬT`), `MediaFilterPillBar` (`Tất cả`, `Chiến dịch`, `Câu chuyện`, `Vinh danh`), search input, `InlineComposerCardComponent` with Poll builder, and `PostCardComponent` with `PollCardComponent`.
- **`/channels/sotay` (`HandbookChannelViewComponent`)**:
  - 2-column `#0F172A` Dark Theme reader: Left `320px` `HandbookTocPane` (`MỤC LỤC SỔ TAY`, search box, `tr. X` page badges, mandatory articles list) + Right `HandbookPdfReaderPane` (34-page toolbar, page jumper `< Trang X / 34 >`, `"Đánh dấu đã đọc"`, `"Tải PDF"`, and PDF iframe).
- **`PostStatsModalComponent`**:
  - Displays `PostStatsSummaryCard`, Tab 1 `Theo phòng ban` (`Nhắc đơn vị`), Tab 2 `Danh sách người nhận` (`Nhắc tất cả chưa đọc` & `Nhắc cá nhân`), and Tab 3 `Đăng ký sự kiện` (`Nhắc đăng ký`).

---

## 2. Verification & Code Quality Metrics

- **Production Build**: `npm run build` (`ng build vnpt-ai-social-web --configuration production`) passed with **0 errors and 0 warnings**.
- **File Size Rule (`<= 200` lines)**: Verified across all files in `src/app/` — maximum file length is `200` lines (`ai-social-state.service.ts`).
