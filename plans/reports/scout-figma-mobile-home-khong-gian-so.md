# Brainstorm & Figma UI Specification Report: Trang Home ("Không gian số")

- **Date**: 2026-10-15 16:08
- **Project**: `ai-social-web` (`/Users/vinhcuong/Dev/ai-social-web`)
- **Figma File Key**: `H07FLmauVKE8It4WHlsxXs` (`3.1- VNPT GoConnect - Desktop -- Visual Design`)
- **Root Frame Node**: `3987:126348` (`Workspace - Truyền thông - Mặc định`, `1920×1080`)
- **Target Scope Nodes**:
  - `4818:54017` (`Frame 2121454382` — Header `"Không gian số"`, `1186×28`)
  - `4818:54021` (`Frame 2121454395` — 4 Channel Cards + Emergency Alert Banner + `"LỊCH SẮP TỚI"`, `1186×660`)
- **Excluded Nodes (per user instruction)**: Left Main Rail (`3987:126351`), Sub-menu (`3987:126354`), Right Chat Panel (`3987:128180`), and Bottom `"Tất cả ứng dụng"` section (`4818:54182`).

---

## 1. Screen Overview & Layout Hierarchy

Trang Home (**"Không gian số"**) đóng vai trò là cổng vào trung tâm (Hub) trước khi hoặc song song với màn hình chi tiết kênh truyền thông (`/channels/:channelId`). Giao diện gồm **4 vùng chính** xếp dọc (`flex-direction: column`, `max-width: 1186px`, `width: 100%`):

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ [1] HEADER ROW (4818:54017) — 1186 × 28px, space-between                         │
│     "Không gian số" (Inter 600 18px/28px #001230)                 [🔔 20×20 SVG] │
├──────────────────────────────────────────────────────────────────────────────────┤
│                        ↕ gap: 12px–16px                                          │
│ [2] 4 CHANNEL CARDS GRID (4818:54022) — 4 columns × 288×190px, gap: 12px         │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐  │
│ │ [3D Bell 78×78] │ │ [3D Cal  78×78] │ │ [3D Mega 78×78] │ │ [3D Book 78×78] │  │
│ │  [• 1 chưa đọc] │ │   [• 2 tin mới] │ │                 │ │[4 bài bắt buộc] │  │
│ │ Thông báo khẩn  │ │ Thông tin sự... │ │ Truyền thông... │ │ Sổ tay văn hoá  │  │
│ │ Sự cố, an ninh..│ │ Sự kiện, thông..│ │ Chiến dịch, câu │ │ Giới thiệu, văn │  │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘  │
│                        ↕ gap: 16px                                               │
│ [3] EMERGENCY ALERT BANNER (4818:54058) — 1186 × 92px, r=8px, pad=16px           │
│ ┌────────┬─────────────────────────────────────────────────────────────────────┐ │
│ │ [60×60 │ Cảnh báo email giả mạo Ban giám đốc yêu cầu chuyển tiền             │ │
│ │  3D !] │ Không bấm link, không chuyển tiền. Đã bấm link...    Chi tiết →     │ │
│ └────────┴─────────────────────────────────────────────────────────────────────┘ │
│                        ↕ gap: 16px                                               │
│ [4] UPCOMING SCHEDULE ("LỊCH SẮP TỚI") (4818:54126) — 587 × 346px (left half)    │
│ ┌──────────────────────────────────────────────────────────────┐                 │
│ │ [📅 32×32] LỊCH SẮP TỚI  [Quản trị]        [3D Calendar 134×89 abs top:-8px] │                 │
│ │ ┌──────────────────────────────────────────────────────────┐ │                 │
│ │ │ ┃ 07/11 08/11 │ ● Hội thảo Quốc gia lần thứ XXIX...      │ │                 │
│ │ │ ┃ 15/11       │ ● Đào tạo bắt buộc ATTT (buổi 1) - 2026  │ │                 │
│ │ │ ┃ 15/12       │ ● Đào tạo bắt buộc ATTT (buổi 2) / ● Tech│ │                 │
│ │ │ ┃ 21/12       │ ● Đào tạo bắt buộc ATTT (buổi 3) / ● Sự..│ │                 │
│ │ │ ┃ 31/11       │ ● YEP VNPT AI 2027                       │ │                 │
│ │ └──────────────────────────────────────────────────────────┘ │                 │
│ └──────────────────────────────────────────────────────────────┘                 │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Design Tokens & Color Palette (Exact Figma Extraction)

| Category | Token Name | Hex Code | Opacity | CSS Variable / Usage |
|---|---|---|---|---|
| **Surface / Background** | Page Surface | `#FFFFFF` | 100% | Nền chính trang Không gian số |
| | Emergency Alert Bg | `#FEF4F4` | 100% | Nền banner cảnh báo khẩn (`4818:54058`) |
| | Schedule Container Bg | `#F0F6FF` | 100% | Nền khung danh sách lịch sắp tới (`4818:54132`) và ô icon lịch (`4818:54128`) |
| | Schedule Day Row Bg | `#FFFFFF` | 100% | Nền từng dòng ngày trong lịch sắp tới (`r=4px`) |
| | Schedule 3D Glow | `#B8E4FF` | 100% | Quầng sáng dưới icon lịch 3D (`4818:54180`) |
| **Borders & Dividers** | Card 1 Border (Pink) | `#FEEBEC` | 100% | Viền `1px solid` cho Card Thông báo khẩn & Alert Banner |
| | Card 2 Border (Amber) | `#FBEDCF` | 100% | Viền `1px solid` cho Card Thông tin sự kiện |
| | Card 3 Border (Purple) | `#E5DDF8` | 100% | Viền `1px solid` cho Card Truyền thông nội bộ |
| | Card 4 Border (Blue) | `#DBE9FF` | 100% | Viền `1px solid` cho Card Sổ tay văn hoá |
| | Schedule Left Bar | `#5C9AFF` | 100% | Thanh dọc `4px` bên trái mỗi dòng ngày (`border-radius: 0 4px 4px 0`) |
| **Typography Colors** | Section Title | `#001230` | 100% | Tiêu đề `"Không gian số"` (`4818:54019`) |
| | Primary Heading | `#000A1A` | 100% | Tiêu đề 4 Card, tiêu đề Alert, `"LỊCH SẮP TỚI"`, nhãn ngày (`07/11`...) |
| | Body Primary | `#1A2A45` | 100% | Nội dung mô tả Alert & tên sự kiện trong lịch sắp tới |
| | Body Secondary | `#404D64` | 100% | Phụ đề (subtitle) của 4 Card kênh |
| | Brand Link / Action | `#0057E5` | 100% | Nút `"Chi tiết →"`, icon lịch `#0057E5` |
| **Badges / Tags (`Tag / Colorful`)** | Pink Tag (`1 chưa đọc`) | Bg `#FEEBEC` / Stroke `#FCBBBE` / Text `#F52833` | 100% | Pill góc phải trên của Card 1 (`4818:54029`) |
| | Amber Tag (`2 tin mới`) | Bg `#FFF9EB` / Stroke `#FFE2A3` / Text `#DB8F00` | 100% | Pill góc phải trên của Card 2 (`4818:54040`) |
| | Blue Tag (`4 bài bắt buộc`) | Bg `#F0F6FF` / Stroke `#C7DCFF` / Text `#0057E5` | 100% | Pill góc phải trên của Card 4 (`4818:54057`) |
| | Purple Tag (`Quản trị`) | Bg `#F5F2FD` / Stroke `#D1C4F2` / Text `#5F31D3` | 100% | Pill cạnh tiêu đề `"LỊCH SẮP TỚI"` (`4818:54131`) |
| **Schedule Category Dots (`8×8px`)** | Hội thảo / Nghỉ lễ | `#B00810` | 100% | Chấm tròn đỏ sẫm (`Hội thảo Quốc gia...`) |
| | Đào tạo bắt buộc | `#F66200` | 100% | Chấm tròn cam (`Đào tạo bắt buộc ATTT...`) |
| | Tech Talk | `#5F31D3` | 100% | Chấm tròn tím (`Tech Talk #14`) |
| | Sự kiện nội bộ | `#0057E5` | 100% | Chấm tròn xanh VNPT (`Sự kiện liên hoan...`, `YEP VNPT AI 2027`) |

---

## 3. Typography Scale

Font family xuyên suốt trên Figma là **`Inter`** (fallback `'SVN-Gilroy', -apple-system, BlinkMacSystemFont, sans-serif`):

| Style Role | Figma Node Example | Font Size | Font Weight | Line Height | Color |
|---|---|---|---|---|---|
| **Page Header** (`Không gian số`) | `4818:54019` | `18px` | `600` (SemiBold) | `28px` | `#001230` |
| **Channel Card Title** (`Thông báo khẩn`...) | `4818:54027` | `20px` | `600` (SemiBold) | `28px` | `#000A1A` |
| **Channel Card Subtitle** | `4818:54028` | `14px` | `400` (Regular) | `20px` | `#404D64` |
| **Alert Title** (`Cảnh báo email...`) | `4818:54063` | `16px` | `600` (SemiBold) | `24px` | `#000A1A` |
| **Alert Subtitle & Action** (`Chi tiết`) | `4818:54065` | `14px` | `400` (Regular) | `20px` | `#1A2A45` / `#0057E5` |
| **Schedule Header** (`LỊCH SẮP TỚI`) | `4818:54130` | `16px` | `600` (SemiBold) | `24px` | `#000A1A` |
| **Schedule Date Label** (`07/11`, `15/11`...) | `4818:54137` | `14px` | `600` (SemiBold) | `20px` | `#000A1A` |
| **Schedule Event Title** | `4818:54142` | `14px` | `500` (Medium) | `20px` | `#1A2A45` |
| **Tag / Badge Pill** (`1 chưa đọc`, `Quản trị`...) | `4818:54032` | `12px` | `500` (Medium) | `16px` | Theo màu từng Tag |

---

## 4. Component Breakdown & Exact Specifications

### 4.1. Header Row (`4818:54017`)
- **Container**: `display: flex; align-items: center; justify-content: space-between; width: 100%; height: 28px; margin-bottom: 16px;`
- **Left**: Text `"Không gian số"` (`18px`, weight `600`, line-height `28px`, color `#001230`).
- **Right**: Nút chuông thông báo `20×20px` (`src/assets/ai-social/home/ic-notification-bubble.svg`) có chấm đỏ `#F52833`.

### 4.2. 4 Channel Cards Grid (`4818:54022`)
- **Grid Container**: `display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; width: 100%;` (Responsive: `< 1100px` chuyển sang `repeat(2, 1fr)`, `< 640px` chuyển sang `1fr`).
- **Card Item (`Card/workspace`)**:
  - Kích thước chuẩn trên Figma: `288 × 190px`, `border-radius: 12px`, `padding: 24px 16px`, `display: flex; flex-direction: column; justify-content: space-between; gap: 12px; position: relative; overflow: hidden; cursor: pointer`.
  - Background: Ảnh nền sóng pastel (`background-size: cover; background-position: center`) kết hợp lớp phủ gradient nhẹ từ Figma `linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)`.
  - **3D Icon Box**: `width: 78px; height: 78px; object-fit: contain;` ở góc trên trái.
  - **Badge Pill (`Tag / Colorful`)**: Đặt `position: absolute; top: 18px; right: 16px; height: 24px; padding: 0 8px; border-radius: 100px; display: inline-flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 500; line-height: 16px;`.
  - **4 Card Metadata**:

| # | Channel ID | Title | Subtitle | Background Image | 3D Icon (`78×78`) | Card Border | Badge Text & Style |
|---|---|---|---|---|---|---|---|
| 1 | `emergency` | `Thông báo khẩn` | `Sự cố, an ninh mạng, chỉ đạo gấp` | `bg-hong.png` | `thong-bao-khan.png` | `1px solid #FEEBEC` | `• 1 chưa đọc` (`#FEEBEC` bg, `#FCBBBE` border, `#F52833` text + 6px dot) |
| 2 | `events` | `Thông tin sự kiện` | `Sự kiện, thông báo, nhân sự, lịch nghỉ` | `bg-vang.png` | `thong-tin-su-kien.png` | `1px solid #FBEDCF` | `• 2 tin mới` (`#FFF9EB` bg, `#FFE2A3` border, `#DB8F00` text + 6px dot) |
| 3 | `internal_media` | `Truyền thông nội bộ` | `Chiến dịch, câu chuyện, vinh danh` | `bg-tim.png` | `truyen-thong-noi-bo.png` | `1px solid #E5DDF8` | *(Không có badge)* |
| 4 | `culture_handbook` | `Sổ tay văn hoá` | `Giới thiệu, văn hoá VNPT, nội quy` | `bg-xanh.png` | `so-tay-van-hoa.png` | `1px solid #DBE9FF` | `4 bài bắt buộc` (`#F0F6FF` bg, `#C7DCFF` border, `#0057E5` text, không có dot) |

- **Tương tác (Interactive Flow)**: Click vào bất kỳ Card nào sẽ điều hướng sang `/channels/:channelId` (trang 3-pane chi tiết kênh đã hoàn thiện ở Phase 02–05).

### 4.3. Active Emergency Alert Banner (`4818:54058`)
- **Container**: `width: 100%; min-height: 92px; padding: 16px; border-radius: 8px; background: #FEF4F4; border: 1px solid #FEEBEC; display: flex; align-items: center; gap: 12px;`
- **Left Thumbnail (`4818:54059`)**: `width: 60px; height: 60px; border-radius: 12px; flex-shrink: 0;` hiển thị `src/assets/ai-social/home/tin-khan.png`.
- **Right Content (`4818:54062`)**: `display: flex; flex-direction: column; gap: 3px; flex: 1; min-width: 0;`
  - **Title (`4818:54063`)**: `"Cảnh báo email giả mạo Ban giám đốc yêu cầu chuyển tiền"` (`16px`, weight `600`, line-height `24px`, color `#000A1A`).
  - **Subtitle Row (`4818:54064`)**: `display: flex; align-items: center; flex-wrap: wrap; gap: 3px;`
    - Text: `"Không bấm link, không chuyển tiền. Đã bấm link thì đổi mật khẩu & báo bộ phận IT"` (`14px`, weight `400`, line-height `20px`, color `#1A2A45`).
    - Inline CTA (`4818:54066`): `padding: 0 8px; height: 20px; display: inline-flex; align-items: center; gap: 4px; color: #0057E5; font-size: 14px; font-weight: 400; cursor: pointer;` gồm chữ `"Chi tiết"` + icon mũi tên `ic-arrow-right.svg` (`20×20px`). Khi bấm sẽ mở chi tiết bản tin khẩn (`/channels/emergency?articleId=emg-001`).

### 4.4. Upcoming Schedule Card — `"LỊCH SẮP TỚI"` (`4818:54126`)
- **Outer Wrapper (`4818:54126`)**: `width: 587px; max-width: 100%; padding-top: 8px; display: flex; flex-direction: column; gap: 12px; position: relative;`
- **Header Row (`4818:54127`)**: `display: flex; align-items: center; gap: 8px; padding: 4px 4px 0 4px; height: 36px;`
  - Icon Box (`4818:54128`): `32×32px`, `border-radius: 8px`, `background: #F0F6FF`, `padding: 8px`, chứa `ic-calendar-upcoming.svg` (`16×16px`).
  - Title (`4818:54130`): `"LỊCH SẮP TỚI"` (`16px`, weight `600`, line-height `24px`, color `#000A1A`).
  - Role Pill (`4818:54131`): `"Quản trị"` (`height: 24px; padding: 0 10px; border-radius: 100px; background: #F5F2FD; border: 1px solid #D1C4F2; color: #5F31D3; font-size: 12px; font-weight: 500;`).
- **Floating 3D Calendar (`4818:54179`)**:
  - `position: absolute; top: -8px; right: 33px; width: 134px; height: 89px; pointer-events: none; z-index: 2;`
  - Hiển thị `src/assets/ai-social/home/lich-sap-toi-3d.png` (đã bao gồm cả quầng sáng `#B8E4FF` và lịch 3D + mây). Phần chân lịch chờm nhẹ xuống viền trên của khung `#F0F6FF` tạo hiệu ứng nổi 3D đúng chuẩn Figma.
- **Schedule Body Container (`4818:54132`)**:
  - `background: #F0F6FF; border-radius: 12px; padding: 12px; display: flex; flex-direction: column; gap: 8px; position: relative; z-index: 1;`
- **Day Group Row (`4818:54133`...`4818:54172`)**:
  - `background: #FFFFFF; border-radius: 4px; padding: 4px 4px 4px 0; display: flex; align-items: stretch; gap: 8px;`
  - **Left Accent Bar (`Rectangle 240648811`)**: `width: 4px; background: #5C9AFF; border-radius: 0 4px 4px 0; flex-shrink: 0;`
  - **Date Column (`57px` width)**: `padding: 4px 8px; display: flex; flex-direction: column; justify-content: center; gap: 2px; flex-shrink: 0;`
    - Text ngày (`07/11`, `08/11`...): `14px`, weight `600`, line-height `20px`, color `#000A1A`.
  - **Events List Column (`flex: 1`)**: `display: flex; flex-direction: column; justify-content: center; gap: 4px; padding: 4px 0;`
    - Mỗi sự kiện là 1 hàng ngang (`display: flex; align-items: flex-start; gap: 8px;`):
      - Chấm tròn (`8×8px`, `border-radius: 50%`, `margin-top: 6px`, `flex-shrink: 0`) tô màu theo loại sự kiện (`#B00810`, `#F66200`, `#5F31D3`, `#0057E5`).
      - Tên sự kiện (`14px`, weight `500`, line-height `20px`, color `#1A2A45`).

---

## 5. Downloaded Visual Asset Manifest (Saved in Source)

Toàn bộ **16 file PNG (2x retina) & SVG** đã được tải trực tiếp từ Figma API về cả 2 thư mục `/Users/vinhcuong/Dev/ai-social-web/src/assets/ai-social/home/` và `/Users/vinhcuong/Dev/ai-social-web/src/assets/ai-social/`:

| Asset Name | Figma Node / ImageRef | Format | Dimensions | Size | Local Path in Source |
|---|---|---|---|---|---|
| `bg-hong.png` | `a336e9e8...` (`4818:54023`) | PNG | `576×380` (2x) | 231 KB | `src/assets/ai-social/home/bg-hong.png` |
| `bg-vang.png` | `b55aee75...` (`4818:54034`) | PNG | `576×380` (2x) | 229 KB | `src/assets/ai-social/home/bg-vang.png` |
| `bg-tim.png` | `6bae7200...` (`4818:54045`) | PNG | `576×380` (2x) | 235 KB | `src/assets/ai-social/home/bg-tim.png` |
| `bg-xanh.png` | `d5685715...` (`4818:54051`) | PNG | `576×380` (2x) | 239 KB | `src/assets/ai-social/home/bg-xanh.png` |
| `thong-bao-khan.png` | `4818:54024` | PNG (2x) | `156×156` (`78×78` @2x) | 29.0 KB | `src/assets/ai-social/home/thong-bao-khan.png` |
| `thong-tin-su-kien.png` | `4818:54035` | PNG (2x) | `156×156` (`78×78` @2x) | 29.6 KB | `src/assets/ai-social/home/thong-tin-su-kien.png` |
| `truyen-thong-noi-bo.png` | `4818:54046` | PNG (2x) | `156×156` (`78×78` @2x) | 29.9 KB | `src/assets/ai-social/home/truyen-thong-noi-bo.png` |
| `so-tay-van-hoa.png` | `4818:54052` | PNG (2x) | `156×156` (`78×78` @2x) | 26.8 KB | `src/assets/ai-social/home/so-tay-van-hoa.png` |
| `tin-khan.png` | `4818:54059` | PNG (2x) | `120×120` (`60×60` @2x) | 28.3 KB | `src/assets/ai-social/home/tin-khan.png` |
| `lich-sap-toi-3d.png` | `4818:54179` | PNG (2x) | `268×178` (`134×89` @2x) | 99.9 KB | `src/assets/ai-social/home/lich-sap-toi-3d.png` |
| `lich-sap-toi-calendar.png` | `4818:54181` | PNG (2x) | `268×178` (`134×89` @2x) | 47.5 KB | `src/assets/ai-social/home/lich-sap-toi-calendar.png` |
| `ic-notification-bubble.svg` | `4818:54020` | SVG | `20×20` | 1.1 KB | `src/assets/ai-social/home/ic-notification-bubble.svg` |
| `ic-arrow-right.svg` | `I4818:54066;25268:13951` | SVG | `20×20` | 431 B | `src/assets/ai-social/home/ic-arrow-right.svg` |
| `ic-calendar-upcoming.svg` | `4818:54129` | SVG | `16×16` | 3.2 KB | `src/assets/ai-social/home/ic-calendar-upcoming.svg` |
| `ic-calendar-upcoming-box.svg` | `4818:54128` | SVG | `32×32` | 3.4 KB | `src/assets/ai-social/home/ic-calendar-upcoming-box.svg` |
| `ic-dot-red.svg` / `ic-dot-amber.svg` | `4818:54030` / `4818:54041` | SVG | `6×6` | 333 B | `src/assets/ai-social/home/ic-dot-red.svg` |

---

## 6. Recommended Angular 22 Architecture & Routing Strategy

Để tuân thủ nguyên tắc **KISS / YAGNI / DRY** và giới hạn **< 200 dòng/file**, đề xuất cấu trúc module `features/ai-social/pages/home-khong-gian-so/`:

1. **Routing (`ai-social.routes.ts`)**:
   - Route mặc định `/home` (hoặc `/channels` redirect về `/home` làm trang chủ Không gian số): Hiển thị `AiSocialHomePageComponent`.
   - Khi click vào 1 trong 4 Card kênh (`emergency`, `events`, `internal_media`, `culture_handbook`) -> `router.navigate(['/channels', card.channelId])`.
   - Khi click `"Chi tiết →"` trên Banner cảnh báo khẩn -> `router.navigate(['/channels', 'emergency'], { queryParams: { articleId: alert.articleId } })`.
   - Khi click vào 1 sự kiện trong `"LỊCH SẮP TỚI"` -> `router.navigate(['/channels', 'events'], { queryParams: { articleId: item.articleId } })`.

2. **Component Breakdown (4 focused Standalone OnPush components, mỗi file < 130 dòng)**:
   - `src/app/features/ai-social/pages/home-khong-gian-so/ai-social-home-page.component.ts`: Trang tổng hợp gồm Header `"Không gian số"`, 4 Channel Cards, Emergency Alert Banner, và Upcoming Schedule Card.
   - `src/app/features/ai-social/components/home-widgets/home-channel-cards-grid.component.ts`: Render 4 thẻ `Card/workspace` với ảnh nền sóng pastel, icon 3D `78×78px` và pill `Tag / Colorful`.
   - `src/app/features/ai-social/components/home-widgets/home-emergency-alert-banner.component.ts`: Render banner `#FEF4F4` với thumbnail `tin-khan.png` (`60×60px`) và nút `"Chi tiết →"`.
   - `src/app/features/ai-social/components/home-widgets/home-upcoming-schedule-card.component.ts`: Render khối `"LỊCH SẮP TỚI"` (`587px`) với tag `"Quản trị"`, ảnh nổi 3D `lich-sap-toi-3d.png` (`top: -8px; right: 33px`), và 5 nhóm ngày kèm chấm màu phân loại.

---

## 7. Unresolved Questions / Decisions Needed

1. **Điều hướng mặc định sau khi vào web (`/`)**: Bạn muốn khi mở trang chủ (`/`) sẽ vào thẳng trang **Home "Không gian số"** này (và khi bấm vào từng Card kênh mới mở màn hình 3-pane `/channels/:channelId`), hay giữ nút quay lại `"Không gian số"` trên thanh header của màn hình `/channels/:channelId`? (Khuyến nghị: Đặt `/home` làm trang mặc định và thêm nút breadcrumb `"← Không gian số"` trên `/channels/:channelId` để chuyển qua lại mượt mà).
