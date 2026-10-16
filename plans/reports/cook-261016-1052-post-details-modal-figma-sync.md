# Cook Report: Triển khai Đồng bộ Modal Chi tiết Tương tác Bài viết theo Figma Node #4361:14403

- **Thời gian**: 2026-10-16 10:52
- **Trạng thái**: Hoàn thành (Success)
- **Mục tiêu**: Tái cấu trúc hoàn toàn `PostStatsModalComponent` từ dạng layout 4 ô KPI cũ sang thiết kế chuẩn Figma Desktop 3.1 Node `#4361:14403`.

---

## 1. Các hạng mục đã thực thi

1. **Cập nhật Interface & Seed Data**:
   - Bổ sung `isHearted?: boolean; isShared?: boolean;` vào [PostRecipientUserItem](file:///Users/vinhcuong/Dev/ai-social-web/src/app/core/models/ai-social-extended.models.ts).
   - Bổ sung danh sách phòng ban và nhân sự mẫu chi tiết vào [SEED_POST_UNIT_BREAKDOWN](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/services/ai-social-seed-meta.data.ts) và `SEED_POST_RECIPIENTS` khớp 100% tên phòng ban/nhân sự trên Figma (Trương Thành Long, Trần Thị Lan Hương, Phạm Tuấn Anh, Nguyễn Phú Trung Anh, Nguyễn Thị Ngọc Anh, Đinh Diệu Anh).

2. **Cập nhật Logic Component ([post-stats-modal.component.ts](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/components/post-stats-modal/post-stats-modal.component.ts))**:
   - Quản lý 4 tab tương tác: `read` (Đã đọc), `heart` (Thả tim), `share` (Đã chia sẻ), `unread` (Chưa đọc).
   - Bộ lọc phòng ban dạng pill với trạng thái `selectedUnitId`.
   - Tìm kiếm real-time theo tên nhân sự, chức danh hoặc phòng ban.
   - Hàm `exportExcel()`: Xuất danh sách tương tác lọc động ra file CSV định dạng UTF-8 BOM, tương thích hoàn toàn với Microsoft Excel tiếng Việt.
   - Giữ độ dài file ở mức **141 dòng** (tuân thủ giới hạn <200 LOC).

3. **Cập nhật Template ([post-stats-modal.component.html](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/components/post-stats-modal/post-stats-modal.component.html))**:
   - **Header Bar**: Pill tag `Thông báo khẩn` (icon loa đỏ trên nền `#FEEBEC`), mini progress bar (99x6px), tỷ lệ `182/230 đã đọc`, chấm phân cách `•`, thời hạn đọc `Đọc xong trước 11:00` và nút đóng `✕`.
   - **Post Summary Banner Card**: Nền gradient `#F0F7FE` $\rightarrow$ `#E7F2FE`, viền `#DBE9FF`, thumbnail 64x64px, tiêu đề bài viết (20px SemiBold), thời gian đăng và người đăng.
   - **Tabs & Search Row**: Hàng 4 tab hành vi kèm badge số lượng (`heart` có badge đỏ `#F52833`), bên phải là ô tìm kiếm 180x40px với icon kính lúp.
   - **Department Filter Pills**: Hàng nút pill bo tròn (`Tất cả` + các phòng ban kèm số lượng).
   - **Recipients List Card**: Danh sách nhân sự với avatar tròn 32px, họ tên, chức danh, mốc thời gian tương tác, icon tích kép xanh dương `tick-double-01` và trái tim đỏ `favourite`.
   - **Footer**: 2 nút căn giữa chuẩn Figma: `Đóng` (Outline 131x40px viền `#0057E5`) và `Xuất Excel` (Primary 131x40px nền `#0057E5`).
   - Giữ độ dài template ở mức **144 dòng** (tuân thủ giới hạn <200 LOC).

4. **Cập nhật SCSS Styling ([post-stats-modal.component.scss](file:///Users/vinhcuong/Dev/ai-social-web/src/app/features/ai-social/components/post-stats-modal/post-stats-modal.component.scss))**:
   - Đồng bộ token thiết kế Figma: `#0057E5`, `#F0F7FE`, `#DBE9FF`, `#FEEBEC`, `#FCBBBE`, `#F52833`, `#1A2A45`, `#404D64`, `#667183`, `#CCD0D5`.
   - Xử lý responsive mượt mà và cuộn danh sách tối đa `280px`.
   - Giữ độ dài file SCSS ở mức **168 dòng** (tuân thủ giới hạn <200 LOC).

---

## 2. Kết quả kiểm thử build

- **Lệnh**: `npm run build`
- **Kết quả**: Exit code `0` (Success, 0 errors, 0 warnings).
