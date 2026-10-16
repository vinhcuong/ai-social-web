---
title: "Remove Left Sidebar, Fix RBAC Permissions & Align Emergency Channel with Figma 4257:65795"
description: "Bỏ hoàn toàn Sidebar trái trên toàn bộ Web, đồng bộ quyền RBAC với Mobile, và dựng lại bộ Soạn bài Inline + Kênh Thông báo khẩn chuẩn 100% Figma 4257:65795"
status: "completed"
priority: "high"
effort: "2h"
branch: "main"
tags: ["ai-social-web", "shell-layout", "rbac", "inline-composer", "emergency-channel", "figma-4257-65795"]
created: "2026-10-15T17:10:00+07:00"
---

# Implementation Plan Overview: Sidebar Removal, RBAC Fix & Emergency Channel Figma Sync

## Context & Reports
- **Brainstorm Report 1 (Sidebar & RBAC)**: [brainstormer-261015-1658-sidebar-and-emergency-composer-audit.md](../reports/brainstormer-261015-1658-sidebar-and-emergency-composer-audit.md)
- **Brainstorm Report 2 (Emergency Figma `4257:65795`)**: [brainstormer-261015-1706-emergency-channel-figma-exact-ui.md](../reports/brainstormer-261015-1706-emergency-channel-figma-exact-ui.md)
- **Cook Execution Report**: [cook-261015-1721-sidebar-removal-and-emergency-figma-sync.md](../reports/cook-261015-1721-sidebar-removal-and-emergency-figma-sync.md)

## Phases

| Phase | Title | Status | Link |
|---|---|---|---|
| **Phase 01** | Bỏ hẳn Sidebar trái trên `AiSocialShellComponent` & Sửa quyền RBAC `AiSocialAuthService` | Completed | [phase-01-remove-sidebar-and-fix-rbac-permissions.md](./phase-01-remove-sidebar-and-fix-rbac-permissions.md) |
| **Phase 02** | Nâng cấp `InlineComposerCardComponent` chuẩn Figma `4257:85483` (`Hình 3`) | Completed | [phase-02-inline-composer-figma-4257-85483.md](./phase-02-inline-composer-figma-4257-85483.md) |
| **Phase 03** | Chuẩn hoá `EmergencyChannelViewComponent` chuẩn Figma `4257:65795` (`Hình 2`) | Completed | [phase-03-emergency-channel-view-figma-4257-65795.md](./phase-03-emergency-channel-view-figma-4257-65795.md) |
