export const PHONENUMBER_REGEX = /^(0|\+84)[35789][0-9]{8}$/;

export const storageKey = {
  phone: 'gcn_phone',
  otpCreateDate: 'otp_create_date',
  token: 'gcn_token',
  refToken: 'gcn_refresh_token',
  user: 'gcn_user',
  account: 'gcn_account',
  aiSocialToken: 'ai_social_access_token',
  aiSocialTokenExpiry: 'ai_social_access_token_expiry',
  aiSocialMe: 'ai_social_me_cache',
} as const;

export type ChannelCode = 'khan' | 'sukien' | 'truyenthong' | 'sotay';

export interface ChannelMeta {
  code: ChannelCode;
  name: string;
  shortName: string;
  subtitle: string;
  accentColor: string;
  softBgColor: string;
  iconSvg: string;
}

export const CHANNELS_META: readonly ChannelMeta[] = [
  {
    code: 'khan',
    name: 'Thông báo khẩn',
    shortName: 'Khẩn cấp',
    subtitle: 'Tin chỉ đạo khẩn cấp & xác nhận bắt buộc toàn tập đoàn',
    accentColor: '#DC2626',
    softBgColor: '#FEF2F2',
    iconSvg: 'icons/channel_emergency',
  },
  {
    code: 'sukien',
    name: 'Thông tin sự kiện công ty',
    shortName: 'Sự kiện',
    subtitle: 'Lịch trình, đăng ký tham dự & khảo sát sự kiện nội bộ',
    accentColor: '#0284C7',
    softBgColor: '#F0F9FF',
    iconSvg: 'icons/channel_event',
  },
  {
    code: 'truyenthong',
    name: 'Truyền thông nội bộ',
    shortName: 'Truyền thông',
    subtitle: 'Bản tin hoạt động, thành tựu & đời sống VNPT',
    accentColor: '#2563EB',
    softBgColor: '#EFF6FF',
    iconSvg: 'icons/channel_media',
  },
  {
    code: 'sotay',
    name: 'Sổ tay văn hoá',
    shortName: 'Sổ tay',
    subtitle: 'Cẩm nang văn hoá, quy định & tài liệu đào tạo chính thức',
    accentColor: '#7C3AED',
    softBgColor: '#F5F3FF',
    iconSvg: 'icons/channel_handbook',
  },
] as const;
