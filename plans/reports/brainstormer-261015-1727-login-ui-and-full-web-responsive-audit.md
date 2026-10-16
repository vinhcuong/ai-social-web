# Báo cáo Phân tích & Phương án Xử lý: Giao diện Login/OTP & Responsive Toàn bộ Web (VNPT AI Social)

**Ngày tạo:** 2026-10-15  
**Loại báo cáo:** Brainstorm / UI-UX & Responsive Audit  
**Trạng thái:** Sẵn sàng lên Plan / Thực thi (`/cook`)

---

## 1. Nguyên nhân gốc rễ khiến màn hình `/login` bị vỡ giao diện ("xấu thảm hại")

Qua kiểm tra trực tiếp [login.component.html](file:///Users/vinhcuong/Dev/ai-social-web/src/app/auth/login/login.component.html) và [login.component.scss](file:///Users/vinhcuong/Dev/ai-social-web/src/app/auth/login/login.component.scss):

1. **Lệch 100% tên class CSS giữa HTML và SCSS (Zero CSS Rule Match)**:
   - Trong [login.component.html](file:///Users/vinhcuong/Dev/ai-social-web/src/app/auth/login/login.component.html): Sử dụng hệ thống class `.auth-page`, `.auth-card`, `.brand-header`, `.brand-logo`, `.brand-title`, `.brand-subtitle`, `.auth-form`, `.field-label`, `.text-input`, `.submit-btn`, `.demo-btn`, `.mode-switch`, `.link-btn`.
   - Trong [login.component.scss](file:///Users/vinhcuong/Dev/ai-social-web/src/app/auth/login/login.component.scss): Lại đang chứa toàn bộ class cũ của trang OTP (`.login-page-wrapper`, `.login-form-container`, `.brand-section`, `.form-input-login`, `.dev-token-section`, `.footer-section`).
   - **Hậu quả**: Không có bất kỳ dòng CSS nào được áp dụng cho HTML của `/login`! Ảnh `logo.png` bị hiển thị kích thước gốc khổng lồ bên góc trái, các ô input và button bị giãn 100% chiều ngang màn hình với style mặc định thô sơ của trình duyệt.

2. **Bất cập ở màn hình `/otp` ([otp-auth.component.scss](file:///Users/vinhcuong/Dev/ai-social-web/src/app/auth/otp-auth/otp-auth.component.scss))**:
   - Đang `@import '../login/login.component.scss'` và phụ thuộc vào ảnh nền tĩnh `/assets/images/background/login_bg.png` cùng căn lề phải cứng (`justify-content: flex-end`).
   - Khi thu nhỏ màn hình hoặc khi ảnh nền không phủ hết tỉ lệ màn hình rộng/hẹp, form bị lệch và thiếu đồng bộ với ngôn ngữ thiết kế **VNPT AI Social (Figma 3.1)**.

---

## 2. Thiết kế chuẩn mới cho màn hình `/login` & `/otp` (Chuẩn Figma VNPT AI Social)

### 2.1. Bố cục 2 cột hiện đại trên Desktop (`>= 960px`) & Thu gọn mượt mà trên Tablet/Mobile (`< 960px`)
- **Nền tổng thể (`.auth-page`)**:
  - Gradient mesh sang trọng đồng bộ với AI Social (`linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 45%, #EEF2FF 100%)`) kèm quầng sáng trang trí tinh tế.
- **Khối Showcase bên trái (`.auth-showcase` - Hiển thị trên Desktop `>= 960px`)**:
  - Badge thương hiệu: Logo `assets/ai-social/logo.png` + `"VNPT AI Social — Không gian Truyền thông & Văn hoá nội bộ"`.
  - Tiêu đề lớn & mô tả ngắn gọn.
  - **4 Thẻ giới thiệu nhanh 4 kênh chính thống** (dùng chính bộ 3D/SVG assets đã tải từ Figma):
    1. **Thông báo khẩn** (`#FFF1F0`, icon 3D Bell) — Chỉ đạo & cảnh báo quan trọng.
    2. **Quản lý sự kiện** (`#EEF2FF`, icon 3D Calendar) — Lịch trình & sự kiện toàn Tập đoàn.
    3. **Truyền thông nội bộ** (`#ECFDF5`, icon Media) — Tin tức, bình luận & tương tác đa chiều.
    4. **Sổ tay văn hoá** (`#FFFBEB`, icon Handbook) — Cẩm nang quy định & văn hoá VNPT.
- **Khối Card Đăng nhập bên phải (`.auth-card` - `max-width: 440px`, bo góc `24px`, đổ bóng mềm)**:
  - **Header**: Logo `logo.png` (`56×56px`, bo góc `14px`, shadow nhẹ) + Tiêu đề `"Chào mừng tới VNPT AI Social"` + Phụ đề rõ ràng.
  - **Chuyển chế độ thông minh (Segmented Tabs)**:
    - Tab 1: **Tài khoản VNPT (`Email / Mật khẩu`)** hoặc chuyển sang **Xác thực OTP (`/otp`)**.
    - Tab 2: **Dán Bearer Token (`SSO / Dev Token`)** cho môi trường tích hợp nhanh.
  - **Form controls chuẩn mực**:
    - Input chiều cao `46px`, bo góc `12px`, viền `#E2E8F0`, hiệu ứng focus `#175CD3` (`box-shadow: 0 0 0 3px rgba(23, 92, 211, 0.12)`).
    - Nút chính **Đăng nhập** (`height: 46px`, gradient `#175CD3 -> #1D4ED8`, chữ trắng đậm, hover nâng nhẹ).
    - Nút phụ **Trải nghiệm nhanh (Chế độ Demo)** (`border: 1px dashed #93C5FD`, nền `#EFF6FF`, màu `#175CD3`, kèm badge nhỏ) để vào thẳng hệ thống khi test.

---

## 3. Báo cáo Audit & Giải pháp Responsive Toàn bộ Web (Desktop / Tablet / Mobile)

Để đảm bảo toàn bộ web hoạt động hoàn hảo trên mọi kích thước màn hình từ **Mobile nhỏ (`360px - 480px`)**, **Mobile lớn (`481px - 640px`)**, **Tablet (`641px - 1024px`)**, đến **Desktop (`1025px - 1440px+`)**, dưới đây là danh sách các điểm nghẽn hiện tại và giải pháp xử lý triệt để:

| Phân hệ / Component | File liên quan | Vấn đề Responsive hiện tại | Giải pháp xử lý chuẩn hóa |
| :--- | :--- | :--- | :--- |
| **1. Auth (`/login` & `/otp`)** | [login.component.scss](file:///Users/vinhcuong/Dev/ai-social-web/src/app/auth/login/login.component.scss)<br>[otp-auth.component.scss](file:///Users/vinhcuong/Dev/ai-social-web/src/app/auth/otp-auth/otp-auth.component.scss) | • `/login` mất toàn bộ style do lệch class.<br>• `/otp` căn phải cứng, vỡ trên màn hình nhỏ. | • Viết mới bộ style đồng bộ cho `.auth-page`, `.auth-container`, `.auth-showcase`, `.auth-card`.<br>• `< 960px`: Ẩn cột showcase hoặc thu gọn, căn giữa `.auth-card` (`width: 100%; max-width: 440px`).<br>• `< 480px`: Giảm padding card từ `32px` xuống `20px`, font-size tiêu đề vừa vặn. |
| **2. Topbar Shell (`AiSocialShellComponent`)** | [ai-social-shell.component.scss](file:///Users/vinhcuong/Dev/ai-social-web/src/app/shell/ai-social-shell.component.scss) | • Trên màn `< 640px`, dòng `.brand-sub` + tên user + nút `"Đăng xuất"` dài làm chật thanh header `60px`.<br>• `.notif-dropdown` (`width: 360px`) có thể tràn mép trái màn hình `360px`. | • `< 768px`: Ẩn `.brand-sub` (`"Truyền thông & Văn hoá nội bộ"`), ẩn `.user-meta` (chỉ giữ avatar).<br>• `< 640px`: Thu gọn padding topbar còn `0 12px`; nút `.logout-action-btn` ẩn chữ `"Đăng xuất"` (chỉ hiện icon `34×34px` gọn đẹp); `.notif-dropdown` dùng `width: min(360px, calc(100vw - 24px)); right: -44px`. |
| **3. Trang chủ (`AiSocialHomePageComponent`)** | [ai-social-home-page.component.scss](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/views/home-page/ai-social-home-page.component.scss) | • `.upcoming-schedule-card` fix cứng `width: 587px` (chỉ mới xử lý ở `1180px`, nhưng trên Tablet `640px-1180px` cần đồng bộ 100% với grid 2 cột).<br>• Trên `< 640px`: `.emergency-alert-banner` nhiều thông tin dễ bị ép hẹp; icon lịch 3D `.floating-calendar-3d` (`124px`) đè lên chữ. | • `<= 1180px`: `.upcoming-schedule-card { width: 100%; }`.<br>• `<= 640px`: `.emergency-alert-banner` giảm padding `12px`, icon `44×44px`, cho phép `.banner-top-row` wrap mượt; thu nhỏ `.floating-calendar-3d` (`width: 84px; opacity: 0.25`); `.schedule-day-row` chuyển sang xếp dọc ngày ở trên, danh sách sự kiện ở dưới khi `< 480px`. |
| **4. Kênh Thông báo khẩn (`EmergencyChannelViewComponent`)** | [emergency-channel-view.component.scss](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/views/channels/emergency-channel-view/emergency-channel-view.component.scss) | • `.emerg-top-row` có ảnh `110×110px` + hàng tag + cụm nút hành động (`Đã xem`, `Cần hỗ trợ`) nằm chung 1 hàng ngang nên trên màn `< 640px` sẽ bị ép chữ.<br>• `.channel-figma-header` có badge thương hiệu bên phải dễ chật trên mobile. | • `<= 768px`: `.channel-figma-header` cho phép `flex-wrap: wrap; gap: 10px`, ẩn chữ phụ trên `.brand-pill-badge` khi `< 540px`.<br>• `<= 640px`: Trong `.emerg-post-card`, thu gọn `.emerg-thumb-wrap` xuống `72×72px`, cho `.emerg-meta-tags-row` wrap các nút hành động xuống dòng riêng gọn gàng, giảm font-size `.emerg-post-title` từ `18px` xuống `16px`. |
| **5. Khung Soạn bài (`InlineComposerCardComponent`)** | [inline-composer-card.component.scss](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/components/inline-composer-card/inline-composer-card.component.scss) | • Thanh `.composer-action-bar` chứa 4 nút icon SVG + nút `Hủy` + nút `Đăng bài` có thể bị chật trên màn `< 480px`. | • `<= 560px`: Cho `.composer-action-bar` `flex-wrap: wrap; gap: 10px`, cụm `.composer-trailing-actions` tự động căn phải hoặc chiếm 100% chiều ngang trên màn `< 420px`. |
| **6. Kênh Quản lý sự kiện (`EventChannelViewComponent` & `EventSidebarCalendarComponent`)** | [event-channel-view.component.scss](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/views/channels/event-channel-view/event-channel-view.component.scss)<br>[event-sidebar-calendar.component.scss](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/components/event-sidebar-calendar/event-sidebar-calendar.component.scss) | • `.event-search-bar` và `.ev-post-header` chưa wrap tốt trên màn `< 640px`.<br>• `.heatmap-months-grid` (3 cột) hơi chật trên màn `< 400px`. | • `<= 640px`: `.event-search-bar { flex-wrap: wrap; }`, `.ev-post-header { flex-wrap: wrap; }`, `.footer-tier-actions { flex-wrap: wrap; width: 100%; }`.<br>• `<= 420px`: `.heatmap-months-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }`. |
| **7. Kênh Truyền thông nội bộ & Post Card (`MediaChannelViewComponent` & `PostCardComponent`)** | [media-channel-view.component.scss](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/views/channels/media-channel-view/media-channel-view.component.scss)<br>[post-card.component.scss](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/components/post-card/post-card.component.scss) | • `.media-search-input` có `min-width: 220px` gây tràn nhẹ khi đặt cạnh nút quay lại trên màn `< 480px`.<br>• `.post-card` có `padding: 20px` và `.media-grid.multi` 2 cột cố định. | • `<= 640px`: `.media-search-input { min-width: 0; width: 100%; }`, `.post-card { padding: 14px; }`, `.post-card-footer { flex-wrap: wrap; gap: 8px; }`.<br>• `<= 480px`: `.media-grid.multi { grid-template-columns: 1fr; }`. |
| **8. Kênh Sổ tay văn hoá & Modal Thống kê (`HandbookChannelViewComponent` & `PostStatsModalComponent`)** | [handbook-channel-view.component.scss](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/views/channels/handbook-channel-view/handbook-channel-view.component.scss)<br>[post-stats-modal.component.scss](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/components/post-stats-modal/post-stats-modal.component.scss) | • `.reader-toolbar` của Sổ tay có nhiều nút trên 1 hàng.<br>• `.stats-modal-dialog` có `.users-filter-bar` chứa tabs + ô search `180px` dễ bị chật trên mobile. | • `<= 640px`: `.reader-toolbar { flex-wrap: wrap; }`, `.reader-actions { width: 100%; justify-content: flex-start; flex-wrap: wrap; }`.<br>• `<= 640px`: Trong Modal thống kê, `.users-filter-bar` chuyển `flex-direction: column; align-items: stretch;`, `.user-search-input { width: 100%; }`. |

---

## 4. Đề xuất Thực thi

Tất cả các hạng mục trên đều tập trung vào tầng giao diện (HTML/SCSS), không làm thay đổi logic nghiệp vụ hay API hiện có, và tuân thủ nghiêm ngặt quy tắc **mỗi file code `<= 200` dòng**.

Bạn có thể gõ **`/cook`** (hoặc **`/plan`**) để mình tiến hành cập nhật ngay:
1. Thiết kế lại toàn diện màn hình **`/login`** và **`/otp`** đẹp, hiện đại, chuẩn thương hiệu **VNPT AI Social**.
2. Bổ sung hệ thống **Responsive Breakpoints (`1180px`, `960px`, `768px`, `640px`, `480px`)** cho toàn bộ 8 phân hệ của web.
3. Kiểm tra build (`ng build`) và verify trực tiếp trên các kích thước màn hình Desktop, Tablet, Mobile.
