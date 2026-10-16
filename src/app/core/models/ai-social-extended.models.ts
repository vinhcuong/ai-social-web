import { ChannelCode } from '../constants/storage-keys';
import { BadgeCounts, PostModel, PostRecipientSummary } from './ai-social.models';

export interface SyncResponse {
  badges: BadgeCounts;
  activeEmergency?: PostModel | null;
  serverTime?: string;
}

export interface DraftListResponse {
  items: PostModel[];
  nextCursor: string | null;
}

export interface PostVersionItem {
  id: string;
  versionNumber: number;
  title: string;
  body?: string | null;
  editType?: 'major' | 'minor' | string;
  editNote?: string | null;
  editedByName?: string | null;
  createdAt: string;
}

export interface ReviewHistoryItem {
  id: string;
  action: 'SUBMITTED' | 'APPROVED' | 'RETURNED' | string;
  actorName: string;
  actorAvatarUrl?: string | null;
  reason?: string | null;
  createdAt: string;
}

export interface PostDepartmentBreakdownItem {
  unitId: string;
  unitName: string;
  unitCode?: string | null;
  totalCount: number;
  readCount: number;
  unreadCount: number;
  remindedAt?: string | null;
}

export interface PostUnitBreakdownResponse {
  summary: PostRecipientSummary;
  units: PostDepartmentBreakdownItem[];
}

export interface PostRecipientUserItem {
  userId: string;
  fullName: string;
  employeeCode?: string | null;
  jobTitle?: string | null;
  unitName?: string | null;
  avatarUrl?: string | null;
  status: 'read' | 'unread';
  readAt?: string | null;
  remindedAt?: string | null;
  isHearted?: boolean;
  isShared?: boolean;
}

export interface PostRecipientsResponse {
  items: PostRecipientUserItem[];
  total: number;
  nextCursor?: string | null;
}

export interface RemindRequestPayload {
  targetType: 'all' | 'unit' | 'users';
  unitId?: string;
  userIds?: string[];
}

export interface RemindResponse {
  remindedCount: number;
  cooldownMinutes?: number;
  message?: string;
}

export interface EventRegistrationSummaryModel {
  postId: string;
  registeredCount: number;
  declinedCount: number;
  unregisteredCount: number;
  maxAttendees?: number | null;
  isRegistered?: boolean;
}

export interface EventDepartmentStatItem {
  unitId: string;
  unitName: string;
  totalCount: number;
  registeredCount: number;
  unregisteredCount: number;
}

export interface UpcomingScheduleEventItem {
  id: string;
  postId: string;
  title: string;
  categoryLabel: string;
  categoryCode: string;
  dotColor: string;
  channelCode: ChannelCode;
}

export interface UpcomingScheduleDayGroup {
  dateRangeLabel: string;
  events: UpcomingScheduleEventItem[];
}

export interface PostInteractionUserItem {
  employeeId: string;
  employeeCode: string;
  fullName: string;
  title?: string | null;
  unitName: string;
  unitCode?: string | null;
  gcnUserId?: string | null;
  avatarUrl?: string | null;
  interactedAt: string;
  shareCount?: number;
}

export interface PostInteractionListResponse {
  items: PostInteractionUserItem[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface QueryInteractionListParams {
  page?: number;
  limit?: number;
  before?: string;
}

export interface TrackSharePayload {
  source?: 'web' | 'app';
  target?: 'copy_link' | 'system_share' | string;
}

export interface TrackShareResponse {
  success: boolean;
  shareCount: number;
  myShareCount: number;
}

