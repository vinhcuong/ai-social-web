import { ChannelCode } from '../../../core/constants/storage-keys';
import { PostModel } from '../../../core/models/ai-social.models';

export const SEED_ACTIVE_EMERGENCY_POST: PostModel = {
  id: 'khan-post-01', code: 'KHAN-2026-001', channelCode: 'khan',
  title: 'Cảnh báo email giả mạo Ban giám đốc yêu cầu chuyển tiền',
  content: {
    what: 'Email của ban giám đốc đang bị đối tượng lợi dụng giả mạo và yêu cầu kế toán chuyển tiền gấp.\nKhông bấm link, không chuyển tiền.\nĐã bấm link thì đổi mật khẩu & báo bộ phận IT.',
    deadline: '11:00',
    body: 'Email của ban giám đốc đang bị đối tượng lợi dụng giả mạo và yêu cầu kế toán chuyển tiền gấp.\nKhông bấm link, không chuyển tiền.\nĐã bấm link thì đổi mật khẩu & báo bộ phận IT.',
  },
  categoryCode: 'an-toan-thong-tin', status: 'published', isMandatory: true,
  pinnedAt: '2026-10-15T10:05:00.000Z', publishedAt: '2026-10-15T10:05:00.000Z', createdAt: '2026-10-15T10:05:00.000Z',
  currentVersion: 1, requiredAckVersion: 1, authorId: 'usr-sec-01', authorName: 'Bộ phận IT', authorCode: 'VNPT-IT',
  recipientCount: 260, readCount: 238, heartCount: 64, isRead: false, isHearted: false,
  audienceAll: true, audienceUnits: [], audienceSummary: 'Toàn công ty',
  requireRegistration: false, registeredCount: 0, isRegistered: false,
  attachments: [],
};

export const SEED_POSTS_BY_CHANNEL: Record<ChannelCode, PostModel[]> = {
  khan: [
    SEED_ACTIVE_EMERGENCY_POST,
    {
      id: 'khan-post-02', code: 'KHAN-2026-002', channelCode: 'khan',
      title: 'Thông báo khám sức khoẻ định kỳ',
      content: {
        what: 'Công ty thông báo lịch khám sức khỏe định kỳ đối với người lao động đang làm việc tại Hà Nội\n\n🩸 **Lấy máu xét nghiệm**\n- Thời gian: 07h15–09h30, Thứ Tư, ngày 16/9/2026.\n- Địa điểm: Hội trường tầng 1, Tòa nhà VNPT AI, số 57A Huỳnh Thúc Kháng, phường Láng, Hà Nội.\n\n*Lưu ý: Người lao động vui lòng nhịn ăn sáng trước khi lấy máu và thực hiện theo hướng dẫn của nhân viên y tế.*',
        body: 'Công ty thông báo lịch khám sức khỏe định kỳ đối với người lao động đang làm việc tại Hà Nội',
      },
      status: 'published', isMandatory: false,
      publishedAt: '2026-10-15T08:00:00.000Z', createdAt: '2026-10-15T08:00:00.000Z',
      currentVersion: 1, requiredAckVersion: 1, authorId: 'usr-hr-02', authorName: 'Nguyễn Hiền',
      recipientCount: 260, readCount: 238, heartCount: 112, isRead: true, isHearted: true,
      audienceAll: true, audienceUnits: [], audienceSummary: 'Toàn công ty',
      requireRegistration: false, registeredCount: 0, isRegistered: false,
      attachments: [
        {
          id: 'att-khan-02',
          fileName: 'Công_văn_triển_khai_khám_sức_khỏe_định_kỳ_năm_2026.pdf',
          fileUrl: '/assets/ai-social/so_tay_van_hoa.pdf',
          fileType: 'application/pdf',
          fileSize: 419840,
          kind: 'document',
        },
      ],
    },
  ],
  sukien: [
    {
      id: 'sukien-post-01', code: 'SK-2026-001', channelCode: 'sukien',
      title: 'Hội thảo Chiến lược AI 2026 & Ra mắt nền tảng VNPT GenAI Enterprise',
      content: {
        what: 'Hội thảo chuyên sâu về lộ trình ứng dụng Agentic AI và LLM nội bộ trong điều hành sản xuất kinh doanh và chăm sóc khách hàng trên toàn Tập đoàn.',
        when: '08:30 07/11/2026 - 17:00 08/11/2026',
        where: 'Hội trường Tầng 25 - Tòa nhà VNPT, 57 Huỳnh Thúc Kháng & Webex trực tuyến',
        link: 'https://goconnect.vnpt.vn/events/ai-strategy-2026',
        body: 'Hội thảo quy tụ các chuyên gia AI hàng đầu của Tập đoàn VNPT cùng đại diện các đơn vị thành viên.',
      },
      categoryCode: 'hoi-thao', eventStartsAt: '2026-11-07T08:30:00.000Z', eventEndsAt: '2026-11-08T17:00:00.000Z',
      pinnedAt: '2026-10-15T07:45:00.000Z', publishedAt: '2026-10-15T07:45:00.000Z', createdAt: '2026-10-15T07:45:00.000Z',
      currentVersion: 1, requiredAckVersion: 1, authorId: 'usr-ev-01', authorName: 'Ban Công nghệ & Chuyển đổi số VNPT',
      isMandatory: false, status: 'published', recipientCount: 2450, readCount: 1620, heartCount: 185,
      isRead: false, isHearted: true, audienceAll: true, audienceUnits: [],
      requireRegistration: true, maxAttendees: 500, registeredCount: 342, isRegistered: false,
      attachments: [
        { id: 'att-ev-01', fileName: 'Agenda-Hoi-thao-Chien-luoc-AI-2026.pdf', fileUrl: '/assets/ai-social/so_tay_van_hoa.pdf', fileType: 'application/pdf', fileSize: 980400, kind: 'document' },
      ],
    },
    {
      id: 'sukien-post-02', code: 'SK-2026-002', channelCode: 'sukien',
      title: 'Khoá đào tạo Kỹ năng số bắt buộc K3/2026 & Tech Talk: GenAI trong vận hành',
      content: {
        what: 'Chương trình đào tạo thực hành kỹ năng làm việc cùng trợ lý AI và quy chuẩn bảo mật dữ liệu nội bộ dành cho toàn bộ khối kỹ thuật và kinh doanh.',
        when: '09:00 - 16:30 15/11/2026',
        where: 'Hệ thống E-Learning VNPT & Phòng Đào tạo Số 3',
        link: 'https://elearning.vnpt.vn/genai-k3',
        body: 'Hoàn thành khóa học và bài kiểm tra trắc nghiệm cuối khóa để được cấp chứng nhận Kỹ năng số 2026.',
      },
      categoryCode: 'dao-tao', eventStartsAt: '2026-11-15T09:00:00.000Z', eventEndsAt: '2026-11-15T16:30:00.000Z',
      publishedAt: '2026-10-13T10:00:00.000Z', createdAt: '2026-10-13T10:00:00.000Z',
      currentVersion: 2, requiredAckVersion: 1, lastMinorEditAt: '2026-10-14T09:00:00.000Z',
      lastMinorEditNote: 'Cập nhật bổ sung đường dẫn phòng học Webex dự phòng.',
      authorId: 'usr-hr-01', authorName: 'Trung tâm Đào tạo & Phát triển Nhân lực VNPT',
      isMandatory: true, status: 'published', recipientCount: 2450, readCount: 1950, heartCount: 142,
      isRead: true, isHearted: false, audienceAll: true, audienceUnits: [],
      requireRegistration: true, maxAttendees: 1000, registeredCount: 890, isRegistered: true, attachments: [],
    },
  ],
  truyenthong: [
    {
      id: 'tt-post-01', code: 'TT-2026-001', channelCode: 'truyenthong',
      title: 'Vinh danh 15 tập thể xuất sắc trong Chiến dịch 90 ngày đêm Chuyển đổi số Quốc gia',
      content: { body: 'Chúc mừng các đơn vị **VNPT-IT**, **VNPT VinaPhone** và **VNPT các tỉnh/thành** đã về đích sớm vượt **135% chỉ tiêu** triển khai nền tảng số trong Quý III/2026.' },
      categoryCode: 'vinh-danh', pinnedAt: '2026-10-15T09:00:00.000Z', publishedAt: '2026-10-15T09:00:00.000Z', createdAt: '2026-10-15T09:00:00.000Z',
      currentVersion: 1, requiredAckVersion: 1, authorName: 'Ban Truyền thông Tập đoàn VNPT',
      isMandatory: false, status: 'published', recipientCount: 2450, readCount: 2110, heartCount: 328,
      isRead: true, isHearted: true, audienceAll: true, audienceUnits: [],
      requireRegistration: false, registeredCount: 0, isRegistered: false, attachments: [],
      poll: {
        id: 'poll-tt-01', question: 'Sáng kiến số nào ấn tượng nhất với bạn trong Quý III/2026?',
        allowMultiple: false, totalVotes: 648,
        options: [
          { id: 'opt-1', text: 'Trợ lý AI GoConnect hỗ trợ CBNV 24/7', voteCount: 312, percentage: 48, isVoted: true },
          { id: 'opt-2', text: 'Tự động hóa giám sát mạng lõi bằng GenAI', voteCount: 204, percentage: 31 },
          { id: 'opt-3', text: 'Số hóa 100% quy trình ký duyệt không giấy tờ', voteCount: 132, percentage: 21 },
        ],
      },
    },
  ],
  sotay: [
    {
      id: 'sotay-post-01', code: 'ST-2026-001', channelCode: 'sotay',
      title: 'Quy tắc Ứng xử Văn hoá Số & Chuẩn mực Giao tiếp Nội bộ VNPT',
      content: { body: 'Tài liệu quy định chuẩn mực ứng xử, bảo mật thông tin và văn hoá hợp tác Số trên môi trường làm việc GoConnect.' },
      chapterCode: 'chuong-1', publishedAt: '2026-10-01T08:00:00.000Z', createdAt: '2026-10-01T08:00:00.000Z',
      currentVersion: 1, requiredAckVersion: 1, authorName: 'Ban Văn hoá Doanh nghiệp VNPT',
      isMandatory: true, status: 'published', recipientCount: 2450, readCount: 2180, heartCount: 95,
      isRead: false, isHearted: false, audienceAll: true, audienceUnits: [],
      requireRegistration: false, registeredCount: 0, isRegistered: false, attachments: [],
    },
  ],
};
