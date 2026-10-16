import { ChannelCode } from '../../../core/constants/storage-keys';
import {
  BadgeCounts,
  ChannelCategoryModel,
  HandbookPdfBookmark,
  HandbookTocResponse,
  MyProgressResponse,
  NotificationItem,
  PublishableUnitNode,
} from '../../../core/models/ai-social.models';
import {
  EventDepartmentStatItem,
  EventRegistrationSummaryModel,
  PostRecipientsResponse,
  PostUnitBreakdownResponse,
  UpcomingScheduleDayGroup,
} from '../../../core/models/ai-social-extended.models';

export const SEED_BADGE_COUNTS: BadgeCounts = { khan: 2, sukien: 3, truyenthong: 0, sotay: 1, total: 6 };

export const SEED_MY_PROGRESS: MyProgressResponse = {
  totalMandatory: 6,
  readMandatory: 5,
  unreadMandatory: 1,
  completionRate: 83,
  byChannel: [
    { channelCode: 'khan', totalMandatory: 2, readCount: 1, unreadCount: 1 },
    { channelCode: 'sotay', totalMandatory: 4, readCount: 4, unreadCount: 0 },
  ],
};

export const SEED_UPCOMING_SCHEDULE: UpcomingScheduleDayGroup[] = [
  {
    dateRangeLabel: '07/11 -\n08/11',
    events: [
      { id: 'sch-1', postId: 'sukien-post-01', title: 'Hội thảo Chiến lược AI 2026', categoryLabel: 'Hội thảo', categoryCode: 'hoi-thao', dotColor: '#B00810', channelCode: 'sukien' },
      { id: 'sch-2', postId: 'sukien-post-02', title: 'Khoá đào tạo Kỹ năng số bắt buộc K3', categoryLabel: 'Đào tạo', categoryCode: 'dao-tao', dotColor: '#F66200', channelCode: 'sukien' },
    ],
  },
  {
    dateRangeLabel: '15/11',
    events: [
      { id: 'sch-3', postId: 'sukien-post-02', title: 'Khoá đào tạo Kỹ năng số bắt buộc K3', categoryLabel: 'Đào tạo', categoryCode: 'dao-tao', dotColor: '#F66200', channelCode: 'sukien' },
      { id: 'sch-4', postId: 'sukien-post-02', title: 'Tech Talk: GenAI trong vận hành', categoryLabel: 'Tech Talk', categoryCode: 'tech-talk', dotColor: '#5F31D3', channelCode: 'sukien' },
    ],
  },
  {
    dateRangeLabel: '15/12',
    events: [
      { id: 'sch-5', postId: 'sukien-post-01', title: 'Ngày hội Gia đình VNPT', categoryLabel: 'Sự kiện', categoryCode: 'su-kien', dotColor: '#0057E5', channelCode: 'sukien' },
    ],
  },
  {
    dateRangeLabel: '21/12',
    events: [
      { id: 'sch-6', postId: 'sukien-post-01', title: 'Giáng sinh văn phòng', categoryLabel: 'Sự kiện', categoryCode: 'su-kien', dotColor: '#0057E5', channelCode: 'sukien' },
    ],
  },
  {
    dateRangeLabel: '31/11',
    events: [
      { id: 'sch-7', postId: 'sukien-post-01', title: 'Tết Dương lịch (nghỉ bù)', categoryLabel: 'Lịch nghỉ', categoryCode: 'lich-nghi', dotColor: '#B00810', channelCode: 'sukien' },
    ],
  },
];

export const SEED_CHANNEL_CATEGORIES: Record<ChannelCode, ChannelCategoryModel[]> = {
  khan: [
    { code: 'thien-tai-bao-lu', name: 'Thiên tai & Bão lũ', postCount: 1 },
    { code: 'dich-benh-y-te', name: 'Dịch bệnh & Y tế', postCount: 0 },
    { code: 'su-co-ha-tang-cntt', name: 'Sự cố Hạ tầng CNTT', postCount: 0 },
    { code: 'an-toan-thong-tin', name: 'An toàn thông tin', postCount: 1 },
  ],
  sukien: [
    { code: 'hoi-thao', name: 'Sự kiện', postCount: 2 },
    { code: 'thong-bao', name: 'Thông báo', postCount: 1 },
    { code: 'dao-tao', name: 'Đào tạo nội bộ', postCount: 2 },
    { code: 'lich-nghi', name: 'Lịch nghỉ', postCount: 1 },
  ],
  truyenthong: [
    { code: 'chien-dich', name: 'Chiến dịch', postCount: 1 },
    { code: 'cau-chuyen', name: 'Câu chuyện', postCount: 1 },
    { code: 'vinh-danh', name: 'Vinh danh', postCount: 1 },
  ],
  sotay: [
    { code: 'chuong-1', name: 'Chương I: Sứ mệnh & Giá trị cốt lõi', postCount: 2 },
    { code: 'chuong-2', name: 'Chương II: Chuẩn mực Đạo đức & Ứng xử', postCount: 2 },
    { code: 'chuong-3', name: 'Chương III: Văn hoá Làm việc Số & Bảo mật', postCount: 2 },
  ],
};

export const SEED_HANDBOOK_BOOKMARKS: HandbookPdfBookmark[] = [
  { id: 'bm-1', title: 'Lời giới thiệu & Thông điệp Ban Lãnh đạo Tập đoàn', pageNumber: 1, level: 1, chapterCode: 'chuong-1' },
  { id: 'bm-2', title: 'Chương I: Sứ mệnh, Tầm nhìn & Hệ giá trị cốt lõi VNPT', pageNumber: 4, level: 1, chapterCode: 'chuong-1' },
  { id: 'bm-3', title: '1.1. Tầm nhìn trở thành Nhà cung cấp dịch vụ số hàng đầu', pageNumber: 6, level: 2, chapterCode: 'chuong-1' },
  { id: 'bm-4', title: 'Chương II: Quy tắc ứng xử & Chuẩn mực giao tiếp nội bộ', pageNumber: 11, level: 1, chapterCode: 'chuong-2' },
  { id: 'bm-5', title: '2.1. Văn hoá tôn trọng, hợp tác và minh bạch thông tin', pageNumber: 14, level: 2, chapterCode: 'chuong-2' },
  { id: 'bm-6', title: 'Chương III: Kỷ luật An toàn thông tin & Không gian làm việc số', pageNumber: 20, level: 1, chapterCode: 'chuong-3' },
  { id: 'bm-7', title: '3.1. Quy định bảo mật dữ liệu khách hàng & tài sản số', pageNumber: 25, level: 2, chapterCode: 'chuong-3' },
  { id: 'bm-8', title: 'Chương IV: Cam kết thực thi & Trách nhiệm của mỗi CBNV', pageNumber: 31, level: 1, chapterCode: 'chuong-3' },
];

export const SEED_HANDBOOK_TOC: HandbookTocResponse = {
  totalMandatory: 4,
  readMandatory: 3,
  chapters: [
    {
      chapterCode: 'chuong-1',
      chapterTitle: 'Chương I: Sứ mệnh & Giá trị cốt lõi',
      order: 1,
      totalPosts: 2,
      readPosts: 1,
      posts: [
        { id: 'sotay-post-01', title: 'Quy tắc Ứng xử Văn hoá Số & Chuẩn mực Giao tiếp Nội bộ VNPT', isMandatory: true, isRead: false, pdfPage: 4 },
        { id: 'sotay-post-02', title: 'Tầm nhìn Nhà cung cấp Dịch vụ Số hàng đầu', isMandatory: true, isRead: true, pdfPage: 6 },
      ],
    },
  ],
};

export const SEED_PUBLISHABLE_UNITS: PublishableUnitNode[] = [
  { id: 'unit-vnpt-it', name: 'Công ty Công nghệ Thông tin VNPT (VNPT-IT)', code: 'VNPT-IT', employeeCount: 850 },
  { id: 'unit-vnpt-net', name: 'Tổng công ty Hạ tầng Mạng (VNPT-Net)', code: 'VNPT-NET', employeeCount: 920 },
  { id: 'unit-vnpt-vnp', name: 'Tổng công ty Dịch vụ Viễn thông (VNPT VinaPhone)', code: 'VNPT-VNP', employeeCount: 680 },
];

export const SEED_POST_UNIT_BREAKDOWN: PostUnitBreakdownResponse = {
  summary: { totalRecipients: 230, readCount: 182, unreadCount: 48, readPercentage: 79 },
  units: [
    { unitId: 'unit-bqt', unitName: 'Ban Quản trị & Nhân sự', totalCount: 2, readCount: 2, unreadCount: 0 },
    { unitId: 'unit-bcl', unitName: 'Ban Chiến lược và Sở hữu trí tuệ', totalCount: 10, readCount: 8, unreadCount: 2 },
    { unitId: 'unit-bkd', unitName: 'Ban Kinh doanh & Tư vấn công nghệ cao', totalCount: 10, readCount: 9, unreadCount: 1 },
    { unitId: 'unit-ttsp', unitName: 'TT Sản phẩm và trải nghiệm', totalCount: 10, readCount: 7, unreadCount: 3 },
    { unitId: 'unit-ttdl', unitName: 'TT Phân tích dữ liệu & Ứng dụng AI đa ngành', totalCount: 2, readCount: 2, unreadCount: 0 },
    { unitId: 'unit-ttnt', unitName: 'TT Nền tảng AI', totalCount: 6, readCount: 5, unreadCount: 1 },
    { unitId: 'unit-ttnc', unitName: 'TT Nghiên cứu & Phát triển công nghệ AI', totalCount: 2, readCount: 2, unreadCount: 0 },
  ],
};

export const SEED_POST_RECIPIENTS: PostRecipientsResponse = {
  total: 8,
  items: [
    { userId: 'u-1', fullName: 'Trương Thành Long', employeeCode: 'VNPT101', jobTitle: 'Kỹ sư Trải nghiệm khách hàng', unitName: 'TT Sản phẩm và trải nghiệm', status: 'read', readAt: '10:57', isHearted: true, isShared: true },
    { userId: 'u-2', fullName: 'Trần Thị Lan Hương', employeeCode: 'VNPT102', jobTitle: 'Chuyên viên Hành chính', unitName: 'Ban Quản trị & Nhân sự', status: 'read', readAt: '10:48', isHearted: true, isShared: true },
    { userId: 'u-3', fullName: 'Phạm Tuấn Anh', employeeCode: 'VNPT103', jobTitle: 'Kỹ sư Trải nghiệm khách hàng', unitName: 'TT Sản phẩm và trải nghiệm', status: 'read', readAt: 'Hôm qua lúc 10:01', isHearted: true },
    { userId: 'u-4', fullName: 'Nguyễn Phú Trung Anh', employeeCode: 'VNPT104', jobTitle: 'Kỹ sư lập trình', unitName: 'TT Nền tảng AI', status: 'read', readAt: 'Hôm qua lúc 10:00', isHearted: true },
    { userId: 'u-5', fullName: 'Nguyễn Thị Ngọc Anh', employeeCode: 'VNPT105', jobTitle: 'Chuyên viên Phân tích nghiệp vụ', unitName: 'Ban Chiến lược và Sở hữu trí tuệ', status: 'read', readAt: '06/10/2026 lúc 08:00', isHearted: true },
    { userId: 'u-6', fullName: 'Đinh Diệu Anh', employeeCode: 'VNPT106', jobTitle: 'Chuyên viên Hợp tác đổi mới sáng tạo', unitName: 'Ban Kinh doanh & Tư vấn công nghệ cao', status: 'read', readAt: '06/10/2026 lúc 10:54', isHearted: true },
    { userId: 'u-7', fullName: 'Lê Hoàng Nam', employeeCode: 'VNPT107', jobTitle: 'Trưởng nhóm Vận hành Mạng', unitName: 'Ban Kinh doanh & Tư vấn công nghệ cao', status: 'unread' },
    { userId: 'u-8', fullName: 'Phạm Thị Lan Anh', employeeCode: 'VNPT108', jobTitle: 'Chuyên viên Nhân sự', unitName: 'Ban Quản trị & Nhân sự', status: 'unread' },
  ],
};

export const SEED_EVENT_REGISTRATION_SUMMARY: EventRegistrationSummaryModel = {
  postId: 'sukien-post-01',
  registeredCount: 342,
  declinedCount: 28,
  unregisteredCount: 130,
  maxAttendees: 500,
  isRegistered: false,
};

export const SEED_EVENT_DEPARTMENT_STATS: EventDepartmentStatItem[] = [
  { unitId: 'unit-vnpt-it', unitName: 'VNPT-IT (Công nghệ Thông tin)', totalCount: 220, registeredCount: 168, unregisteredCount: 52 },
  { unitId: 'unit-vnpt-net', unitName: 'VNPT-Net (Hạ tầng Mạng)', totalCount: 160, registeredCount: 104, unregisteredCount: 56 },
  { unitId: 'unit-vnpt-vnp', unitName: 'VNPT VinaPhone (Kinh doanh)', totalCount: 120, registeredCount: 70, unregisteredCount: 50 },
];

export const SEED_NOTIFICATIONS: NotificationItem[] = [
  { id: 'notif-1', type: 'EMERGENCY', title: '[Khẩn] Cảnh báo email giả mạo Ban giám đốc yêu cầu chuyển tiền', body: 'Yêu cầu xác nhận đã đọc trước 16:30 hôm nay.', postId: 'khan-post-01', channelCode: 'khan', isSeen: false, createdAt: '2026-10-15T08:15:00Z' },
  { id: 'notif-2', type: 'EVENT', title: 'Mời đăng ký: Hội thảo Chiến lược AI 2026', body: 'Sự kiện diễn ra ngày 07/11 - 08/11 tại Hội trường Tầng 25.', postId: 'sukien-post-01', channelCode: 'sukien', isSeen: false, createdAt: '2026-10-15T07:45:00Z' },
];
