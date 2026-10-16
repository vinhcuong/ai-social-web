# Báo Cáo Tổng Hợp (`/brainstorm`): Đồng Bộ Giao Diện, Tính Năng & API từ Mobile (`gcn_ai_social`) lên Web (`ai-social-web`)

- **Date**: 2026-10-15 16:24
- **Target Project**: `/Users/vinhcuong/Dev/ai-social-web` (Angular 22 Standalone + Signals)
- **Source Reference**: `/Users/vinhcuong/Dev/mobile-GCN-2/mobileapp/STM/packages/gcn_ai_social` + Figma `3987:126348`
- **Phạm vi loại trừ (Out of Scope)**: Toàn bộ phần "Không gian số" chung của GoConnect (`iconnect_workspace`: danh sách "Tất cả ứng dụng", "Không gian tùy biến", nhóm app, cấu hình Mail). Web `ai-social-web` chỉ tập trung 100% vào phân hệ **VNPT AI Social (Truyền thông nội bộ & 4 Kênh chính thức)**.

---

## 1. Kiến Trúc Luồng Điều Hướng Tổng Thể (Home Hub ↔ 4 Channel Views)

Trên Mobile (`gcn_ai_social`), kiến trúc điều hướng được quản lý qua `WorkspaceChannelController` + `AiSocialPinnedSection` + `AiSocialChannelContainer`. Khi đưa lên Web (`ai-social-web`), luồng này được đồng bộ 1:1 thông qua cả **State/Signal** lẫn **Angular Router URL** để vừa mượt như SPA vừa hỗ trợ F5 / chia sẻ Deep Link (`/r/p/:code`):

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          TRANG HOME AI SOCIAL (/home)                               │
│  1. Header: Tiêu đề "Truyền thông nội bộ" + Chuông Notification (InAppNotifications)│
│  2. Grid 4 Thẻ Kênh (AiSocialPinnedSection / ChannelPinnedCard):                    │
│     [Thông báo khẩn]  [Thông tin sự kiện]  [Truyền thông nội bộ]  [Sổ tay văn hoá] │
│  3. Banner Cảnh Báo Khẩn Đang Phát (activeEmergency - #FEF4F4 + nút "Chi tiết →")   │
│  4. Khối "LỊCH SẮP TỚI" (587px - Lịch 3D nổi + Tag Quản trị + Danh sách theo ngày)  │
└───────────────┬───────────────────┬─────────────────────┬───────────────────┬───────┘
                │ Click             │ Click               │ Click             │ Click
                ▼                   ▼                     ▼                   ▼
     ┌──────────────────┐ ┌──────────────────┐ ┌───────────────────┐ ┌──────────────────┐
     │ /channels/khan   │ │ /channels/sukien │ │/channels/         │ │ /channels/sotay  │
     │ EmergencyChannel │ │ EventChannelView │ │ truyenthong       │ │ HandbookChannel  │
     │ View (1 cột 680) │ │ (2 cột 680 + 402)│ │ MediaChannelView  │ │ View (2 cột PDF) │
     └──────────────────┘ └──────────────────┘ └───────────────────┘ └──────────────────┘
```

> **Điểm khác biệt quan trọng cần cập nhật trên Web**:
> Hiện tại bản Web vừa dựng ở bước trước đang dùng chung 1 layout 3-cột (Left Sidebar + Feed + Detail) cho cả 4 kênh. Tuy nhiên trên Mobile (`gcn_ai_social`), **mỗi kênh trong 4 kênh có một thiết kế giao diện (View) và nghiệp vụ chuyên biệt hoàn toàn khác nhau** (`EmergencyChannelView`, `EventChannelView`, `MediaChannelView`, `HandbookChannelView`). Cần đồng bộ chính xác 4 View chuyên biệt này lên Web!

---

## 2. Đặc Tả Đồng Bộ Chi Tiết Từng Màn Hình & Tính Năng

### 2.1. Màn Hình 1: Trang Home AI Social (`AiSocialPinnedSection` + Figma `4818:54021`)
- **Nguồn tham chiếu**: `ai_social_pinned_section.dart`, `channel_pinned_card.dart`, `channel_card_meta.dart`, `home_controller.dart`, Figma `4818:54021`.
- **Các khối giao diện & tính năng**:
  1. **Top Bar**: Tiêu đề trang + Nút chuông thông báo (`ic-notification-bubble.svg` có chấm đỏ) mở **Drawer/Popover Thông báo In-App** (`InAppNotificationSheet`: `GET /api/v1/notifications`, đánh dấu đã xem `POST /api/v1/notifications/seen`, click thông báo nhảy thẳng tới bài viết và cuộn/glow `AiSocialHighlightGlow`).
  2. **4 Thẻ Kênh Ghim (`ChannelPinnedCard` — Grid 4 cột `288×190px`, `gap: 12px`)**:
     - `khan` (**Thông báo khẩn**): Nền `bg-hong.png`, viền `#FEEBEC`, icon 3D `thong-bao-khan.png` (`78×78`), pill `• X chưa đọc` (`#FEEBEC` bg, `#FCBBBE` border, `#F52833` text).
     - `sukien` (**Thông tin sự kiện**): Nền `bg-vang.png`, viền `#FBEDCF`, icon 3D `thong-tin-su-kien.png` (`78×78`), pill `• X tin mới` (`#FFF9EB` bg, `#FFE2A3` border, `#DB8F00` text).
     - `truyenthong` (**Truyền thông nội bộ**): Nền `bg-tim.png`, viền `#E5DDF8`, icon 3D `truyen-thong-noi-bo.png` (`78×78`), pill `• X tin mới` (ẩn khi `badgeCount == 0`).
     - `sotay` (**Sổ tay văn hoá**): Nền `bg-xanh.png`, viền `#DBE9FF`, icon 3D `so-tay-van-hoa.png` (`78×78`), pill `X bài bắt buộc` (`#F0F6FF` bg, `#C7DCFF` border, `#0057E5` text).
  3. **Banner Cảnh Báo Khẩn Đang Phát (`alert` `4818:54058`)**:
     - Hiển thị khi `activeEmergency != null` (từ `GET /api/v1/me/sync` → `liveEmergency` / `activeEmergency`).
     - Khung `#FEF4F4`, viền `#FEEBEC`, `padding: 16px`, `border-radius: 8px`, ảnh `tin-khan.png` (`60×60px`), tiêu đề `16px SemiBold #000A1A`, mô tả hành động `what/action` + nút `"Chi tiết →"` (`#0057E5`). Click vào chuyển sang `/channels/khan?highlightId=<post.id>`.
  4. **Khối `"LỊCH SẮP TỚI"` (`4818:54126` — `width: 587px`)**:
     - Header: Hộp icon lịch `32×32px` (`#F0F6FF`) + chữ `"LỊCH SẮP TỚI"` + pill `"Quản trị"` (`#F5F2FD` bg, `#D1C4F2` border, `#5F31D3` text) + hình lịch 3D nổi `lich-sap-toi-3d.png` (`134×89px`, `top: -8px; right: 33px`).
     - Body (`#F0F6FF`, `r=12px`, `padding: 12px`): Tổng hợp từ danh sách bài viết kênh `sukien`, gom nhóm theo ngày (`DD/MM`), mỗi dòng nền trắng (`r=4px`), thanh dọc trái `4px #5C9AFF`, chấm tròn `8×8px` theo danh mục (`#B00810` Hội thảo/Lịch nghỉ, `#F66200` Đào tạo, `#5F31D3` Tech Talk, `#0057E5` Sự kiện). Click vào dòng sự kiện mở `/channels/sukien?highlightId=<post.id>`.

---

### 2.2. Màn Hình 2: Kênh Thông Báo Khẩn (`EmergencyChannelView` — `/channels/khan`)
- **Nguồn tham chiếu**: `emergency_channel_view.dart`, `emergency_post_card.dart`, `emergency_post_header.dart`, `emergency_info_table.dart`, `emergency_post_footer.dart`, `ai_social_inline_composer_card.dart`.
- **Giao diện & Tính năng cần đồng bộ**:
  1. **Header (`ChannelPageHeader`)**: Nút `← Quay lại` (về Home), tiêu đề `"Thông báo khẩn"`, phụ đề `"Sự cố, an ninh mạng, chỉ đạo gấp"`, badge `"VNPT AI"`.
  2. **Bộ Soạn Thảo Inline Đầu Trang (`AiSocialInlineComposerCard(channelCode: 'khan')`)**:
     - Chỉ hiển thị khi `canBroadcastEmergency == true`.
     - Khi focus tự động mở rộng (`InlineComposerEmergencyFields`) gồm:
       - Ô nhập `Tiêu đề thông báo khẩn...`
       - Ô nhập `Hiện trạng (Chuyện gì đang xảy ra?)` (`whatController`)
       - Ô nhập `Cần làm ngay (Hành động bắt buộc)` (`actionController`)
       - Bộ chọn Hashtag danh mục khẩn (`# Thiên tai & Bão lũ` `thien_tai`, `# Dịch bệnh & Y tế` `dich_benh`, `# Sự cố Hạ tầng CNTT` `ha_tang_cntt`, `# An toàn thông tin` `an_ninh`)
       - Thanh công cụ dưới (`InlineComposerCardFooter`): Đính kèm ảnh/tệp, Emoji, Chọn phạm vi đơn vị nhận (`Toàn công ty` hoặc chọn đơn vị từ `/api/v1/posts/publishable-units`), Hẹn giờ phát (`scheduledTime`), Lưu nháp (`saveDraft`), Xem danh sách nháp (`draftCount`), và nút **Phát thông báo khẩn**.
  3. **Danh sách Thẻ `EmergencyPostCard` (Căn giữa `max-width: 680px`, nền trắng, `r=16px`, viền `#CCD0D5`, `padding: 16px`)**:
     - **Header (`EmergencyPostHeader`)**:
       - Trái: Thumbnail `52×52px` (`tin-khan.png` nếu khẩn/bắt buộc, `tin-thuong.png` nếu thường).
       - Giữa trên: Dải Pill Badges gồm:
         - Pill trạng thái: `ĐANG PHÁT` (nền `#F0F6FF`, viền `#C7DCFF`, chữ `#0057E6`, icon `ic_broadcasting.svg`) hoặc `ĐÃ KẾT THÚC` (nền `#F1F5F9`, chữ `#64748B`).
         - Pill hashtag danh mục: `# An toàn thông tin` (nền `#FFF1F2`, viền `#FECDD3`, chữ `#E11D48`).
         - Pill đối tượng nhận: `Toàn công ty` hoặc `Đơn vị (+N)` (nền `#F5F2FD`, viền `#D2C4F2`, chữ `#5F31D3`).
       - Phải trên: 2 nút gọn `Chia sẻ` (`share-03.svg`) & `Copy link` (`link-04.svg`) + Menu ngữ cảnh (`Kết thúc phát khẩn` `/end`, `Sửa`, `Xoá`).
       - Tiêu đề bài viết (`16px Bold #000000`, click vào đánh dấu đã đọc `markAsRead`).
       - Dòng thời gian: `Phát lúc HH:mm • Đọc xong trước HH:mm` (`12px #404D64`).
     - **Lưới Media (`AiSocialMediaGrid`)**: Hiển thị 1–4+ ảnh/video đính kèm.
     - **Hộp Ghi Chú Kết Thúc (`EmergencyEndNoteBox`)**: Hiển thị khi `post.isEnded && post.endNote != null` (Quy tắc `BR-K01`).
     - **Bảng Thông Số Phẳng 4 Dòng (`EmergencyInfoTable` — nền `#F8F8F8`, `r=12px`, `padding: 12px 16px`)**:
       - Dòng 1: `Hiện trạng` (cột nhãn `96px #667183` | giá trị `#000000`).
       - Dòng 2: `Cần làm ngay` (cột nhãn `96px #667183` | giá trị `#000000`).
       - Dòng 3: `Người nhận` (`Toàn công ty • [pill X nhân sự #E9ECEF]`).
       - Dòng 4: `Đính kèm` (danh sách hộp file `EmergencyAttachmentItemBox` có icon PDF/DOC, tên file, dung lượng và nút tải `download-04.svg`).
     - **Footer (`EmergencyPostFooter`)**: Căn góc phải dưới: `"X / Y đã đọc • Danh sách chi tiết"` (`#0057E6`). Click `"Danh sách chi tiết"` mở Modal/Drawer `PostStatsPage`.

---

### 2.3. Màn Hình 3: Kênh Thông Tin Sự Kiện Công Ty (`EventChannelView` — `/channels/sukien`)
- **Nguồn tham chiếu**: `event_channel_view.dart`, `event_filter_tabs_bar.dart`, `event_post_card.dart`, `event_post_header.dart`, `event_post_footer.dart`, `event_month_calendar_card.dart`, `event_monthly_schedule_card.dart`, `event_year_heatmap_widget.dart`, `event_registration_dialogs.dart`.
- **Giao diện & Tính năng cần đồng bộ (Chuẩn Figma `4257:67170`)**:
  1. **Header (`ChannelPageHeader`)**: Tiêu đề `"Thông tin sự kiện công ty"`, phụ đề `"Chiến dịch, câu chuyện, vinh danh"`, badge `"VNPT AI"`.
  2. **Thanh Tab Bộ Lọc Ngang (`EventFilterTabsBar` — cao `48px`, nền trắng, viền dưới `#E6E8EB`)**:
     - 5 Tab có icon riêng và vạch ngăn cách dọc: `Tất cả`, `Sự kiện`, `Thông báo`, `Đào tạo nội bộ`, `Lịch nghỉ`. Tab đang chọn có nền `#F0F6FF`, chữ `#0057E5 SemiBold`.
  3. **Bố Cục 2 Cột (`max-width: 1124px`, `gap: 12px`, nền trang `#F2F4F7`)**:
     - **Cột Trái — Luồng Bài Viết Sự Kiện (`max-width: 680px`, `flex: 1`)**:
       - Ô tìm kiếm `ChannelFeedSearchBar` (`Tìm kiếm` có debounce 300ms).
       - Chip lọc ngày đang chọn (`Ngày DD/MM/YYYY` nền `#F0F6FF` chữ `#0057E5` có nút `×` xoá lọc ngày).
       - Bộ soạn thảo Inline `AiSocialInlineComposerCard(channelCode: 'sukien')` (nếu `canPublish('sukien')`).
       - Danh sách `EventPostCard` (`r=16px`, `padding: 20px`, viền `#E6E8EB`):
         - `EventPostHeader`: Avatar tròn `40×40` (`#F0F6FF`, chữ cái đầu hoặc `composer_ai_avatar.svg`), Tên tác giả + thời gian trước, Pill danh mục góc phải (`Sự kiện` vàng `#FFF9EB`/`#DB8F00`, `Đào tạo nội bộ` xanh `#F0F6FF`/`#0057E5`, `Thông báo` xanh, `Lịch nghỉ` đỏ `#FFF1F2`/`#B00810`), Icon ghim `composer_pin.svg` (nếu `isPinned`), Menu `...` (`Sửa`, `Ghim/Bỏ ghim`, `Xoá`).
         - Tiêu đề (`15px SemiBold #000A1A`), hộp `MinorEditCalloutBox` (nếu bài có chỉnh sửa nhỏ `lastMinorEditNote`), Nội dung chính, dòng lịch inline `📅 <eventWhen> - <eventWhere>`, dòng link `👉 Link tham dự: <registrationUrl>`, danh sách file đính kèm `EmergencyAttachmentItemBox`, lưới ảnh `AiSocialMediaGrid`.
         - `EventPostFooter` (2 tầng):
           - **Tầng 1**: Bên trái (`❤️ heartCount`, `Chia sẻ`, `Copy link`) | Bên phải là **Nút CTA Ngữ cảnh**:
             - Nếu `requireRegistration == true` và chưa đăng ký: Nút **`Đăng ký ngay`** (nền `#0057E5`, chữ trắng) → Mở hộp thoại `EventRegistrationConfirmDialog` (nhập ghi chú `note` → gọi `POST /api/v1/events/{postId}/register`).
             - Nếu `isRegistered == true`: Nút **`Đã đăng ký`** (nền `#F0F6FF`, chữ `#0057E5`) → Mở hộp thoại `EventCancelConfirmDialog` (nhập lý do huỷ → gọi `POST /api/v1/events/{postId}/cancel`).
             - Nếu bài viết có `chapterCode`: Nút **`Mở bài trong sổ tay`** (nền `#F0F6FF`, chữ `#0057E5`) → Mở kênh Sổ tay văn hoá tại chương đó.
           - **Tầng 2**: Căn phải `"X / Y đã đọc • Danh sách chi tiết"` (bấm vào `X / Y đã đọc` gọi `markAsRead`; bấm `"Danh sách chi tiết"` mở thống kê người đọc & danh sách đăng ký sự kiện `EventRegistrationsSheet`).
     - **Cột Phải — Sidebar Lịch 3 Tầng (`width: 402px`, `EventSidebarCalendarColumn`)**:
       - **Card 1 (`EventMonthCalendarCard`)**: Lịch tháng tương tác (`< Tháng M YYYY >`), lưới 7 cột `T2..CN`, mỗi ô ngày hiển thị tối đa 3 chấm màu sự kiện dưới số ngày, click vào ngày để lọc bài viết bên cột trái. Phía dưới có 4 chú giải (Legend): `● Sự kiện (#0057E5)`, `● Đào tạo (#F66200)`, `● Tech Talk (#5F31D3)`, `● Nghỉ lễ (#B00810)`.
       - **Card 2 (`EventMonthlyScheduleCard`)**: Khối `"THÁNG X"` có hình minh họa 3D `thong-tin-su-kien.png` ở góc phải trên + khung `#F0F6FF` liệt kê các ngày có sự kiện trong tháng (`DD | ● Tên sự kiện`). Click vào dòng ngày sẽ chọn ngày đó.
       - **Card 3 (`EventYearHeatmapWidget`)**: Lưới 12 tháng trong năm (`Năm YYYY`) hiển thị mật độ sự kiện, click vào tháng bất kỳ sẽ chuyển `focusedMonth` tới tháng đó.

---

### 2.4. Màn Hình 4: Kênh Truyền Thông Nội Bộ (`MediaChannelView` — `/channels/truyenthong`)
- **Nguồn tham chiếu**: `media_channel_view.dart`, `media_campaign_hero_banner.dart`, `media_filter_pill_bar.dart`, `media_article_card.dart`, `media_video_card.dart`, `post_poll_card.dart`.
- **Giao diện & Tính năng cần đồng bộ**:
  1. **Header (`ChannelPageHeader`)**: Tiêu đề `"Truyền thông nội bộ"`, nút xem **Bản nháp đã lưu** (`ChannelDraftListDialog` có badge số lượng nháp, hỗ trợ xoá lẻ / xoá hàng loạt `bulkDeletePosts` / xuất bản nháp) + nút **`+ Đăng tin`** mở `AiSocialPostComposerSheet`.
  2. **Thanh Tìm Kiếm & Bộ Soạn Thảo Inline**:
     - `ChannelFeedSearchBar` (`Tìm kiếm tin truyền thông...`).
     - `AiSocialInlineComposerCard(channelCode: 'truyenthong')`: Hỗ trợ tạo bài viết nhanh + **Tạo Bình Chọn (`Poll` 2–4 lựa chọn, chọn thời hạn 1/3/7 ngày)** + Bộ đếm ký tự tròn `RadialCharacterCounter` (tối đa 500 ký tự).
  3. **Hero Banner Chiến Dịch (`MediaCampaignHeroBanner`)**:
     - Tự động lấy bài viết có `categoryCode == 'chiendich'` nổi bật hiển thị trên đầu với nền gradient, tag `CHIẾN DỊCH`, tiêu đề, mô tả, tác giả, nút `"Xem chi tiết"` và nút `×` để ẩn banner.
  4. **Thanh Pill Lọc Danh Mục (`MediaFilterPillBar`)**:
     - 4 Pill: `Tất cả`, `Chiến dịch`, `Câu chuyện`, `Vinh danh`.
  5. **Luồng Bài Viết (`MediaVideoCard` & `MediaArticleCard`)**:
     - Nếu bài viết có video (`post.firstVideoAttachment != null`): Hiển thị `MediaVideoCard` với thumbnail video, nút Play lớn ở giữa mở trình phát video (`AiSocialVideoPlayerDialog`).
     - Nếu bài viết thường: Hiển thị `MediaArticleCard` với icon gallery tím `#6D4FD1`, badge `Tin tức` (`#ECE7FB`/`#6D4FD1`), hộp `MinorEditCalloutBox` (nếu có), lưới ảnh `AiSocialMediaGrid`, khối **Bình chọn trực tiếp (`PostPollCard`)** (nếu `post.poll != null`, cho phép vote `POST /api/v1/posts/{id}/poll/vote` và xem thanh tỷ lệ % `PostPollResultBar`), và thanh tương tác `UnifiedPostActionBar` (`Đã đọc`, `Tim`, `Chia sẻ`, `Copy link`).

---

### 2.5. Màn Hình 5: Kênh Sổ Tay Văn Hoá (`HandbookChannelView` — `/channels/sotay`)
- **Nguồn tham chiếu**: `handbook_channel_view.dart`, `handbook_toc_pane.dart`, `handbook_pdf_reader_pane.dart`, `handbook_pdf_page_vector_view.dart`.
- **Giao diện & Tính năng cần đồng bộ (2 Cột Dark Theme chuẩn Web Admin)**:
  1. **Header (`ChannelPageHeader`)**: Nền tối `#0F172A`, tiêu đề `"Sổ tay văn hoá"`, nút **`+ Biên tập`** (hiển thị khi `canPublish('sotay')`).
  2. **Cột Trái — Mục Lục Sổ Tay (`width: 320px`, `HandbookTocPane`, nền `#0F172A`, viền phải `#1E293B`)**:
     - Tiêu đề `"MỤC LỤC SỔ TAY (X MỤC)"`.
     - Ô tìm kiếm nhanh `"Tìm nhanh mục lục..."` (nền `#1E293B`).
     - Danh sách `HandbookPdfBookmark` nạp từ `GET /api/v1/handbook/pdf/bookmarks` & `GET /api/v1/channels/sotay/toc`: Mỗi mục hiển thị icon tài liệu, tên mục lục, và badge số trang `tr. X` (`#312E81` khi đang chọn). Click vào mục bất kỳ sẽ nhảy tới đúng trang `bm.pageNumber`.
     - Chân cột: Nút `"Thêm bài viết sổ tay"` (nếu có quyền xuất bản).
  3. **Cột Phải — Trình Đọc Ấn Phẩm Sổ Tay PDF 34 Trang (`flex: 1`, `HandbookPdfReaderPane`)**:
     - **Top PDF Toolbar (`#1E293B`)**:
       - Icon sách `#818CF8` + Tiêu đề `"Sổ tay Quy chuẩn Văn hoá Doanh nghiệp"` + Badge `PDF 34 trang` (`#4338CA`) + Phụ đề `"Ấn phẩm đồ họa gốc · Đọc & tra cứu trực tiếp"`.
       - Bộ điều khiển nhảy trang: Nút `<` (Trang trước) | Hộp hiển thị `currentPage / 34` | Nút `>` (Trang sau).
       - Nút **`Đánh dấu đọc` / `Đã đọc`** (màu xanh lá `#064E3B` khi đã đọc, gọi API `POST /api/v1/posts/{id}/read` với `ackVersion`).
       - Nút **Tải file PDF gốc** (`GET /api/v1/handbook/pdf/stream` → tải `van-hoa-vnpt.pdf`).
       - Nút **Toàn màn hình (Fullscreen)**.
     - **Main Canvas (`HandbookPdfPageVectorView`)**: Hiển thị trực quan nội dung từng trang trong 34 trang Sổ tay Văn hoá VNPT (kèm khả năng nhúng `<iframe src="/api/v1/handbook/pdf/stream#page=X">` khi backend trả stream PDF thực hoặc hiển thị trang đồ họa vector tương ứng với từng bookmark).

---

### 2.6. Màn Hình / Drawer 6: Thống Kê Tương Tác & Nhắc Đọc 3 Cấp (`PostStatsPage` + `EventRegistrationsSheet`)
- **Nguồn tham chiếu**: `post_stats_page.dart`, `post_stats_summary_card.dart`, `post_department_stats_tab.dart`, `post_recipients_tab_view.dart`, `event_registrations_sheet.dart`.
- **Tính năng cần đồng bộ**:
  - Mở ra khi bấm vào `"Danh sách chi tiết"` ở chân thẻ bài viết (`EmergencyPostFooter` hoặc `EventPostFooter`).
  - **Tổng quan (`PostStatsSummaryCard`)**: Tổng số người nhận, Đã đọc, Chưa đọc, Tỷ lệ hoàn thành (%).
  - **Tab 1 — `Theo phòng ban` (`GET /api/v1/posts/{id}/recipients/units`)**: Danh sách từng đơn vị kèm thanh tiến độ đọc và nút **`Nhắc đơn vị`** (`POST /api/v1/posts/{id}/remind` với `targetType: 'unit'`, xử lý cả thông báo cooldown chống spam 4 giờ `skippedRateLimit`).
  - **Tab 2 — `Người nhận` (`GET /api/v1/posts/{id}/recipients`)**: Lọc theo nhóm (`Tất cả`, `Chưa đọc`, `Đã đọc`), tìm kiếm nhân sự, nút **`Nhắc tất cả chưa đọc`** (`targetType: 'all'`) hoặc nhắc từng cá nhân (`targetType: 'employee'`).
  - **Danh sách đăng ký sự kiện (`EventRegistrationsSheet`)**: Hiển thị khi bài viết có `requireRegistration == true`, phân rã đăng ký theo đơn vị (`GET /api/v1/events/{postId}/registrations/units`) và nhắc đăng ký (`POST /api/v1/events/{postId}/remind-registration`).

---

## 3. Bảng Đồng Bộ Toàn Bộ API (`/api/v1/...`) & Realtime Socket.IO (`/realtime`)

Toàn bộ các endpoint từ `IAiSocialApi` (`i_ai_social_api.dart`) và `AiSocialSocketClient` (`ai_social_socket_client.dart`) sẽ được tích hợp vào `AiSocialApiService` và `AiSocialRealtimeService` trên Web (kèm cơ chế **Smart Fallback**: nếu server `:3100` đang bật thì gọi API thật 100%, nếu chạy độc lập trên môi trường dev không bật backend `:3100` thì tự động fallback sang kho dữ liệu mẫu chuẩn schema `PostModel` để UI luôn hoạt động mượt):

| Nhóm Nghiệp Vụ | Method & Endpoint | Request / Query | Response Model |
|---|---|---|---|
| **1. Auth & RBAC** | `POST /api/v1/auth/exchange` | `{ gcnToken }` | `AuthExchangeResponse` (`accessToken`, `expiresIn`, `employee`) |
| | `GET /api/v1/me` | Header `Bearer <token>` | `UserMeResponse` (`user`, `permissions: EffectivePermissions`) |
| **2. Home, Sync & Badges** | `GET /api/v1/me/sync` | `?since=<iso>` | `{ badges: BadgeCounts, liveEmergency: PostModel? }` |
| | `GET /api/v1/me/badges` | — | `BadgeCounts` (`khan`, `sukien`, `truyenthong`, `sotay`, `total`) |
| | `GET /api/v1/me/progress` | — | `MyProgressResponse` |
| | `GET /api/v1/notifications` | `?page=1&limit=20` | `NotificationListResponse` |
| | `POST /api/v1/notifications/seen` | `{ ids?, all? }` | `{ success: true }` |
| **3. Channel Feeds & Posts** | `GET /api/v1/channels/{code}/categories` | `code`: `khan\|sukien\|truyenthong\|sotay` | `List<ChannelCategoryModel>` |
| | `GET /api/v1/channels/{code}/posts` | `?limit=20&before=&search=&categoryCode=&chapterCode=&campaignId=` | `PostFeedResponse` (`items`, `hasMore`, `nextCursor`) |
| | `GET /api/v1/posts/{id}` | — | `PostModel` |
| | `GET /api/v1/posts/by-code/{code}` | — | `PostModel` |
| | `POST /api/v1/posts/{id}/read` | `{ ackVersion }` | `{ isRead: true }` |
| | `PUT /api/v1/posts/{id}/heart` | — | `{ isHearted, heartCount }` |
| | `POST /api/v1/posts/{id}/poll/vote` | `{ optionIds: string[] }` | `PollModel` |
| **4. Composer, Drafts & Lifecycle** | `POST /api/v1/posts` | `CreatePostPayload` (`status: 'published'\|'draft'`) | `PostModel` |
| | `PUT /api/v1/posts/{id}` | `UpdatePostPayload` | `PostModel` |
| | `DELETE /api/v1/posts/{id}` | — | `DeleteOrHidePostResponse` |
| | `POST /api/v1/posts/bulk-delete` | `{ postIds: string[] }` | `BulkDeletePostsResponse` |
| | `GET /api/v1/posts/drafts` | `?channelCode=&status=&limit=20&offset=0` | `DraftListResponse` |
| | `POST /api/v1/posts/{id}/publish` | `{ scheduledAt? }` | `PostModel` |
| | `DELETE /api/v1/posts/{id}/schedule` | — | `PostModel` |
| | `POST /api/v1/posts/{id}/end` | — | `{ status: 'ended' }` |
| | `PUT /api/v1/posts/{id}/pin` | `{ isPinned: boolean }` | `{ pinnedAt }` |
| | `GET /api/v1/posts/publishable-units` | `?channelCode=...` | `PublishableUnitsResponse` |
| | `POST /api/v1/media/upload-url` | `{ filename, mimeType, sizeBytes, channelCode, purpose }` | `{ uploadUrl, fileUrl, s3Key }` |
| **5. Events Registration** | `POST /api/v1/events/{postId}/register` | `{ note? }` | `EventMyRegistrationModel` |
| | `POST /api/v1/events/{postId}/cancel` | `{ cancellationReason? }` | `{ status: 'cancelled' }` |
| | `GET /api/v1/events/{postId}/my-registration` | — | `EventMyRegistrationModel` |
| | `GET /api/v1/events/{postId}/registrations/summary` | — | `EventRegistrationSummaryModel` |
| | `GET /api/v1/events/{postId}/registrations/units` | — | `List<EventDepartmentStatItem>` |
| | `POST /api/v1/events/{postId}/remind-registration` | `{ targetType, targetId? }` | `RemindResponse` |
| **6. Stats & Reminders** | `GET /api/v1/posts/{id}/recipients/summary` | — | `PostRecipientSummary` |
| | `GET /api/v1/posts/{id}/recipients/units` | — | `PostUnitBreakdownResponse` |
| | `GET /api/v1/posts/{id}/recipients` | `?group=&page=&limit=&search=&unitId=` | `PostRecipientsResponse` |
| | `POST /api/v1/posts/{id}/remind` | `{ targetType: 'all'\|'unit'\|'employee', targetId? }` | `RemindResponse` |
| **7. Handbook (Sổ tay)** | `GET /api/v1/channels/sotay/toc` | — | `HandbookTocResponse` |
| | `GET /api/v1/handbook/pdf/bookmarks` | — | `List<HandbookPdfBookmark>` |
| | `GET /api/v1/handbook/pdf/stream` | — | Binary PDF Stream |
| **8. Socket.IO (`/realtime`)** | Namespace `/realtime`, path `/socket.io` | `auth: { token }` | Events: `badge.invalidate`, `post.published`, `post.ended`, `notification.new`, `post.updated`, `post.hidden` |

---

## 4. Kế Hoạch Triển Khai Đồng Bộ Lên Web (`ai-social-web`)

Để đảm bảo mọi file code đều **< 200 dòng** (theo chuẩn `RULE[user_global]`), sạch sẽ và dễ bảo trì, quá trình thực thi (`/cook`) sẽ chia làm **4 Phase rõ ràng**:

1. **Phase 01 — Đồng bộ Data Layer, Models, API Service (`/api/v1/...`) & Socket.IO Realtime (`/realtime`)**:
   - Chuẩn hoá `ChannelCode` (`'khan' | 'sukien' | 'truyenthong' | 'sotay'`), `PostModel`, `BadgeCounts`, `EffectivePermissions`, `HandbookPdfBookmark`, `PollModel`, `EventRegistrationModels`, `RecipientModels`.
   - Nâng cấp `AiSocialApiService` kết nối đầy đủ các endpoint `/api/v1/...` (với fallback dữ liệu mẫu tự động khi offline/dev) và `AiSocialRealtimeService` lắng nghe 6 sự kiện Socket.IO.
2. **Phase 02 — Dựng Trang Home AI Social (`/home`) & Notification Drawer**:
   - Header + `HomeChannelCardsGridComponent` (4 thẻ 3D pastel `ChannelPinnedCard`) + `HomeEmergencyAlertBannerComponent` (`alert` `#FEF4F4`) + `HomeUpcomingScheduleCardComponent` (`LỊCH SẮP TỚI` + lịch 3D nổi `lich-sap-toi-3d.png`) + `InAppNotificationDrawerComponent`.
3. **Phase 03 — Đồng bộ 2 Kênh Trọng Điểm: `EmergencyChannelView` (`khan`) & `EventChannelView` (`sukien`)**:
   - `EmergencyChannelViewComponent`: `AiSocialInlineComposerCardComponent` + `EmergencyPostCardComponent` (`EmergencyPostHeader`, `EmergencyInfoTable` 4 dòng phẳng, `EmergencyPostFooter`).
   - `EventChannelViewComponent`: `EventFilterTabsBarComponent` (5 tab) + Cột trái `EventPostCardComponent` (kèm dialog Đăng ký / Huỷ đăng ký sự kiện) + Cột phải `EventSidebarCalendarColumnComponent` (Lịch tháng `EventMonthCalendarCard`, Lịch sự kiện `EventMonthlyScheduleCard`, Heatmap 12 tháng `EventYearHeatmapWidget`).
4. **Phase 04 — Đồng bộ 2 Kênh Còn Lại (`MediaChannelView` `truyenthong`, `HandbookChannelView` `sotay`) & Modal Thống Kê (`PostStatsModal`)**:
   - `MediaChannelViewComponent`: Hero Campaign Banner + Filter Pills + Video/Article Card + Bình chọn `PostPollCardComponent` + Quản lý Bản nháp `ChannelDraftListModalComponent`.
   - `HandbookChannelViewComponent`: Giao diện 2 cột Dark Theme (`#0F172A`) gồm `HandbookTocPaneComponent` (34 trang bookmarks + tìm kiếm) & `HandbookPdfReaderPaneComponent` (nhảy trang, đánh dấu đã đọc, tải PDF).
   - `PostStatsModalComponent`: Thống kê theo phòng ban & người nhận + Nhắc đọc 3 cấp (`all`, `unit`, `employee`) + Danh sách đăng ký sự kiện.
