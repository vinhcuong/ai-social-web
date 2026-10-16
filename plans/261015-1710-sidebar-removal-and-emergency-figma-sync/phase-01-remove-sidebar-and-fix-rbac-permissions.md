# Phase 01 — Bỏ hẳn Sidebar Trái trên `AiSocialShellComponent` & Sửa Quyền RBAC `AiSocialAuthService`

## Context Links
- [brainstormer-261015-1658-sidebar-and-emergency-composer-audit.md](../reports/brainstormer-261015-1658-sidebar-and-emergency-composer-audit.md)
- Mobile RBAC Reference: `/Users/vinhcuong/Dev/mobile-GCN-2/mobileapp/STM/packages/gcn_ai_social/lib/src/data/models/permissions_model.dart`

## Overview
- **Priority**: High
- **Status**: Planned
- **Description**: Xoá hoàn toàn thanh `<aside class="shell-sidebar">` bên trái trên toàn bộ Web, chuyển thông tin thương hiệu (`logo.png` + `"VNPT AI Social"`) và thông tin người dùng (`Avatar` + `Họ tên` + `Đơn vị` + `Đăng xuất`) lên thanh Top Header tinh gọn. Đồng thời cập nhật `RbacPermissions` và `AiSocialAuthService.canPublishInChannel()` để đọc đúng cấu trúc JSON của `/api/v1/me` (`roles: string[]`, `publisherChannels: string[]`, `khanTypes: string[]`, `sotayTypes: string[]`).

## Related Code Files
- `src/app/core/models/auth.models.ts`
- `src/app/core/services/ai-social-auth.service.ts`
- `src/app/shell/ai-social-shell.component.ts`
- `src/app/shell/ai-social-shell.component.html`
- `src/app/shell/ai-social-shell.component.scss`

## Implementation Steps
1. **Cập nhật `RbacPermissions` trong `src/app/core/models/auth.models.ts`**:
   - Bổ sung `publisherChannels?: string[]`, `khanTypes?: string[]`, `sotayTypes?: string[]`, `statsScopePaths?: string[]`.
   - Hỗ trợ `roles?: Array<string | { role: string; channelCode?: string | null; unitId?: string | null }>`.
2. **Cập nhật `canPublishInChannel(channelCode)` trong `src/app/core/services/ai-social-auth.service.ts`**:
   - Chuẩn hoá danh sách `roleNames` về chữ thường (`admin`, `tenant_admin`, `emergency_broadcaster`, `moderator`, `publisher`, `channel_admin`, `handbook_editor`, `handbook_approver`).
   - Áp dụng đúng quy tắc từ `permissions_model.dart`:
     - `khan`: `roleNames` có `admin`/`tenant_admin`/`emergency_broadcaster`/`moderator`/`publisher` HOẶC `publisherChannels` chứa `'khan'` HOẶC `khanTypes` không rỗng.
     - `sukien`: `roleNames` có `admin`/`tenant_admin`/`moderator`/`publisher` HOẶC `publisherChannels` chứa `'sukien'`.
     - `truyenthong`: `roleNames` có `admin`/`tenant_admin`/`moderator`/`publisher` HOẶC `publisherChannels` chứa `'truyenthong'`.
     - `sotay`: `roleNames` có `admin`/`tenant_admin`/`handbook_editor`/`handbook_approver`/`moderator` HOẶC `publisherChannels` chứa `'sotay'` HOẶC `sotayTypes` không rỗng.
3. **Tinh gọn `AiSocialShellComponent` (Xoá hoàn toàn Sidebar trái)**:
   - Xoá `<aside class="shell-sidebar">` khỏi `ai-social-shell.component.html` và CSS liên quan trong `ai-social-shell.component.scss`.
   - Thiết kế thanh `shell-topbar` (`height: 60px`):
     - Cụm trái (`topbar-brand`): Link `[routerLink]="['/home']"` gồm `assets/ai-social/logo.png` (`36×36px`) + `"VNPT AI Social"` + phụ đề `"Truyền thông & Văn hoá nội bộ"`.
     - Cụm phải (`topbar-actions`): Nút Chuông thông báo (`ic-notification-bubble.svg` + dropdown) + Khối thông tin người dùng (`Avatar` + `Họ tên` + `Đơn vị`) + Nút Đăng xuất.

## Todo List
- [ ] Cập nhật `RbacPermissions` trong `auth.models.ts`
- [ ] Đồng bộ `canPublishInChannel` trong `ai-social-auth.service.ts`
- [ ] Xoá Sidebar trái và cập nhật Top Header trong `ai-social-shell.component.{ts,html,scss}`
