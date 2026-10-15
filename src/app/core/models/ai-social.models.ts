import { ChannelCode } from '../constants/storage-keys';

export interface AttachmentItem {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  downloadUrl?: string;
  thumbnailUrl?: string;
  s3Key?: string;
  kind?: 'image' | 'video' | 'document' | string;
}

export interface AudienceUnitItem {
  id: string;
  code?: string;
  name: string;
  includeSubUnits?: boolean;
}

export interface PollOptionItem {
  id: string;
  text: string;
  voteCount: number;
  percentage?: number;
  isVoted?: boolean;
  imageUrl?: string;
}

export interface PollModel {
  id?: string;
  question: string;
  allowMultiple?: boolean;
  isAnonymous?: boolean;
  closesAt?: string | null;
  isClosed?: boolean;
  totalVotes: number;
  myVotedOptionIds?: string[];
  options: PollOptionItem[];
}

export interface EventMyRegistrationModel {
  status: 'registered' | 'cancelled' | 'none' | string;
  registeredAt?: string;
  note?: string;
}

export interface PostModel {
  id: string;
  code?: string;
  channelCode: ChannelCode;
  title: string;
  content: Record<string, any> | string | null;
  attachments: AttachmentItem[];
  categoryCode?: string | null;
  chapterCode?: string | null;
  eventStartsAt?: string | null;
  eventEndsAt?: string | null;
  pinnedAt?: string | null;
  publishedAt?: string | null;
  scheduledPublishAt?: string | null;
  endedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  currentVersion: number;
  requiredAckVersion: number;
  lastMinorEditAt?: string | null;
  lastMinorEditNote?: string | null;
  authorId?: string;
  authorName?: string;
  authorCode?: string;
  isMandatory: boolean;
  broadcastReason?: string | null;
  status: 'draft' | 'scheduled' | 'published' | 'hidden' | 'ended' | string;
  recipientCount: number;
  readCount: number;
  heartCount: number;
  isRead: boolean;
  isHearted: boolean;
  audienceAll: boolean;
  audienceUnits: AudienceUnitItem[];
  audienceSummary?: string | null;
  requireRegistration: boolean;
  registrationDeadline?: string | null;
  maxAttendees?: number | null;
  registeredCount: number;
  isRegistered: boolean;
  myRegistration?: EventMyRegistrationModel | null;
  poll?: PollModel | null;
}

export interface PostFeedResponse {
  items: PostModel[];
  hasMore: boolean;
  nextCursor?: string | null;
}

export interface BadgeCounts {
  khan: number;
  sukien: number;
  truyenthong: number;
  sotay: number;
  total?: number;
}

export interface MyProgressChannelStat {
  channelCode: ChannelCode;
  totalMandatory: number;
  readCount: number;
  unreadCount: number;
}

export interface MyProgressResponse {
  totalMandatory: number;
  readMandatory: number;
  unreadMandatory: number;
  completionRate: number;
  byChannel?: MyProgressChannelStat[];
  unreadPosts?: PostModel[];
}

export interface ChannelCategoryModel {
  code: string;
  name: string;
  postCount?: number;
}

export interface HandbookTocArticle {
  id: string;
  code?: string;
  title: string;
  isMandatory: boolean;
  isRead: boolean;
  pdfPage?: number | null;
  publishedAt?: string;
}

export interface HandbookTocChapter {
  chapterCode: string;
  chapterTitle: string;
  order?: number;
  totalPosts: number;
  readPosts: number;
  posts: HandbookTocArticle[];
}

export interface HandbookTocResponse {
  chapters: HandbookTocChapter[];
  totalMandatory?: number;
  readMandatory?: number;
}

export interface HandbookPdfBookmark {
  id?: string;
  title: string;
  pageNumber: number;
  level?: number;
  chapterCode?: string;
}

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body?: string;
  postId?: string;
  channelCode?: ChannelCode;
  isSeen: boolean;
  createdAt: string;
}

export interface NotificationListResponse {
  items: NotificationItem[];
  unreadCount: number;
  total?: number;
}

export interface PublishableUnitNode {
  id: string;
  code: string;
  name: string;
  parentId?: string | null;
  level?: number;
  employeeCount?: number;
  children?: PublishableUnitNode[];
}

export interface PublishableUnitsResponse {
  canBroadcastAll: boolean;
  units: PublishableUnitNode[];
}

export interface PostRecipientSummary {
  totalRecipients: number;
  readCount: number;
  unreadCount: number;
  readPercentage: number;
}
