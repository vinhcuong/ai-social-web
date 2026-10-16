import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ChannelCode } from '../../../core/constants/storage-keys';
import {
  BadgeCounts,
  ChannelCategoryModel,
  EventMyRegistrationModel,
  HandbookPdfBookmark,
  HandbookTocResponse,
  MyProgressResponse,
  NotificationListResponse,
  PollModel,
  PostFeedResponse,
  PostModel,
  PostRecipientSummary,
  PublishableUnitsResponse,
} from '../../../core/models/ai-social.models';
import {
  DraftListResponse,
  EventDepartmentStatItem,
  EventRegistrationSummaryModel,
  PostInteractionListResponse,
  PostRecipientsResponse,
  PostUnitBreakdownResponse,
  QueryInteractionListParams,
  RemindRequestPayload,
  RemindResponse,
  SyncResponse,
  TrackSharePayload,
  TrackShareResponse,
} from '../../../core/models/ai-social-extended.models';
import {
  SEED_BADGE_COUNTS,
  SEED_CHANNEL_CATEGORIES,
  SEED_EVENT_DEPARTMENT_STATS,
  SEED_EVENT_REGISTRATION_SUMMARY,
  SEED_HANDBOOK_BOOKMARKS,
  SEED_HANDBOOK_TOC,
  SEED_MY_PROGRESS,
  SEED_NOTIFICATIONS,
  SEED_POST_RECIPIENTS,
  SEED_POST_UNIT_BREAKDOWN,
  SEED_PUBLISHABLE_UNITS,
} from './ai-social-seed-meta.data';
import { SEED_ACTIVE_EMERGENCY_POST, SEED_POSTS_BY_CHANNEL } from './ai-social-seed-posts.data';

@Injectable({
  providedIn: 'root',
})
export class AiSocialApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.aiSocialApiUrl;

  /**
   * Helper unwrap an toàn (hỗ trợ cả khi interceptor đã bóc tách hoặc chưa)
   */
  private unwrap<T>(res: any): T {
    return (res?.data !== undefined ? res.data : res) as T;
  }

  // 1. Badges & Sync cá nhân
  async getBadges(): Promise<BadgeCounts> {
    try {
      return this.unwrap<BadgeCounts>(await firstValueFrom(this.http.get(`${this.baseUrl}/me/badges`)));
    } catch {
      return { ...SEED_BADGE_COUNTS };
    }
  }

  async getSync(since?: string): Promise<SyncResponse> {
    try {
      const params = since ? new HttpParams().set('since', since) : undefined;
      return this.unwrap<SyncResponse>(await firstValueFrom(this.http.get(`${this.baseUrl}/me/sync`, { params })));
    } catch {
      return {
        badges: { ...SEED_BADGE_COUNTS },
        activeEmergency: SEED_ACTIVE_EMERGENCY_POST,
      };
    }
  }

  async getMyProgress(): Promise<MyProgressResponse> {
    try {
      return this.unwrap<MyProgressResponse>(await firstValueFrom(this.http.get(`${this.baseUrl}/me/progress`)));
    } catch {
      return SEED_MY_PROGRESS;
    }
  }

  // 2. Chuyên mục theo kênh
  async getChannelCategories(channelCode: ChannelCode): Promise<ChannelCategoryModel[]> {
    try {
      const data = this.unwrap<any>(
        await firstValueFrom(this.http.get(`${this.baseUrl}/channels/${channelCode}/categories`)),
      );
      const list = Array.isArray(data) ? data : data?.items || [];
      return list.length ? list : SEED_CHANNEL_CATEGORIES[channelCode] || [];
    } catch {
      return SEED_CHANNEL_CATEGORIES[channelCode] || [];
    }
  }

  // 3. Danh sách bài viết theo kênh
  async getChannelPosts(channelCode: ChannelCode, query: Record<string, any> = {}): Promise<PostFeedResponse> {
    try {
      let params = new HttpParams();
      Object.entries(query).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          params = params.set(k, String(v));
        }
      });
      const data = this.unwrap<PostFeedResponse>(
        await firstValueFrom(this.http.get(`${this.baseUrl}/channels/${channelCode}/posts`, { params })),
      );
      return data?.items?.length ? data : this.filterSeedFeed(channelCode, query);
    } catch {
      return this.filterSeedFeed(channelCode, query);
    }
  }

  private filterSeedFeed(channelCode: ChannelCode, query: Record<string, any>): PostFeedResponse {
    let items = [...(SEED_POSTS_BY_CHANNEL[channelCode] || [])];
    if (query['categoryCode']) {
      items = items.filter((p) => p.categoryCode === query['categoryCode']);
    }
    if (query['chapterCode']) {
      items = items.filter((p) => p.chapterCode === query['chapterCode']);
    }
    const search = (query['search'] || query['q'] || '').trim().toLowerCase();
    if (search) {
      items = items.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          JSON.stringify(p.content || '').toLowerCase().includes(search),
      );
    }
    return { items, hasMore: false, nextCursor: null };
  }

  async getPostDetail(postId: string): Promise<PostModel> {
    try {
      return this.unwrap<PostModel>(await firstValueFrom(this.http.get(`${this.baseUrl}/posts/${postId}`)));
    } catch {
      return (
        Object.values(SEED_POSTS_BY_CHANNEL).flat().find((p) => p.id === postId) ||
        SEED_ACTIVE_EMERGENCY_POST
      );
    }
  }

  async getPostByCode(code: string): Promise<PostModel> {
    try {
      return this.unwrap<PostModel>(await firstValueFrom(this.http.get(`${this.baseUrl}/posts/by-code/${code}`)));
    } catch {
      return (
        Object.values(SEED_POSTS_BY_CHANNEL).flat().find((p) => p.code === code) ||
        SEED_ACTIVE_EMERGENCY_POST
      );
    }
  }

  // 4. Tạo & Xuất bản bài viết (Tạo nháp -> Publish chuẩn Mobile)
  async createPost(payload: Record<string, any>): Promise<PostModel> {
    try {
      const draft = this.unwrap<PostModel>(
        await firstValueFrom(this.http.post(`${this.baseUrl}/posts`, payload)),
      );
      if (payload['status'] === 'draft' || !draft?.id) {
        return draft;
      }
      const published = this.unwrap<PostModel>(
        await firstValueFrom(this.http.post(`${this.baseUrl}/posts/${draft.id}/publish`, {})),
      );
      const mergedAttachments = (published?.attachments?.length ? published.attachments : draft.attachments || payload['attachments'] || []).map(
        (att: any, idx: number) => {
          const localAtt = (payload['attachments'] || [])[idx];
          return {
            ...localAtt,
            ...att,
            downloadUrl: att?.downloadUrl || localAtt?.downloadUrl || att?.fileUrl,
          };
        },
      );
      return {
        ...draft,
        ...published,
        title: published?.title || draft.title || String(payload['title'] || ''),
        content: published?.content || draft.content || payload['content'],
        attachments: mergedAttachments,
        isMandatory: published?.isMandatory ?? draft?.isMandatory ?? !!payload['isMandatory'],
        isRead: Boolean(published?.isRead),
        status: 'published',
        publishedAt: published?.publishedAt || new Date().toISOString(),
      };
    } catch (err: any) {
      if (err?.status && err.status >= 400) {
        throw err;
      }
      const ch = (payload['channelCode'] || 'truyenthong') as ChannelCode;
      const created: PostModel = {
        id: `${ch}-${Date.now()}`,
        channelCode: ch,
        title: String(payload['title'] || ''),
        content: payload['content'] || { body: '' },
        attachments: payload['attachments'] || [],
        categoryCode: payload['categoryCode'] || null,
        chapterCode: payload['chapterCode'] || null,
        eventStartsAt: payload['eventStartsAt'] || null,
        eventEndsAt: payload['eventEndsAt'] || null,
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        currentVersion: 1,
        requiredAckVersion: 1,
        authorName: 'Ban Quản trị Nội bộ VNPT',
        isMandatory: !!payload['isMandatory'],
        status: 'published',
        recipientCount: 2450,
        readCount: 0,
        heartCount: 0,
        isRead: false,
        isHearted: false,
        audienceAll: payload['audienceAll'] !== false,
        audienceUnits: [],
        requireRegistration: !!payload['requireRegistration'],
        maxAttendees: payload['maxAttendees'] || null,
        registeredCount: 0,
        isRegistered: false,
      };
      SEED_POSTS_BY_CHANNEL[ch] = [created, ...(SEED_POSTS_BY_CHANNEL[ch] || [])];
      return created;
    }
  }

  async deletePost(postId: string): Promise<void> {
    try {
      await firstValueFrom(this.http.delete(`${this.baseUrl}/posts/${postId}`));
    } catch {
      (Object.keys(SEED_POSTS_BY_CHANNEL) as ChannelCode[]).forEach((ch) => {
        SEED_POSTS_BY_CHANNEL[ch] = SEED_POSTS_BY_CHANNEL[ch].filter((p) => p.id !== postId);
      });
    }
  }

  // 5. Tương tác Bài viết (Read, Heart, Pin, End)
  async markRead(postId: string, ackVersion = 1): Promise<void> {
    try {
      await firstValueFrom(this.http.post(`${this.baseUrl}/posts/${postId}/read`, { ackVersion }));
    } catch {}
  }

  async toggleHeart(postId: string): Promise<void> {
    try {
      await firstValueFrom(this.http.put(`${this.baseUrl}/posts/${postId}/heart`, {}));
    } catch {}
  }

  async setPostPinned(postId: string, pinned: boolean): Promise<void> {
    try {
      if (pinned) {
        await firstValueFrom(this.http.post(`${this.baseUrl}/posts/${postId}/pin`, {}));
      } else {
        await firstValueFrom(this.http.delete(`${this.baseUrl}/posts/${postId}/pin`));
      }
    } catch {}
  }

  async endEmergencyPost(postId: string, endNote?: string): Promise<void> {
    try {
      await firstValueFrom(this.http.post(`${this.baseUrl}/posts/${postId}/end`, { endNote }));
    } catch {}
  }

  async remindPost(
    postId: string,
    targetOrPayload: 'all' | RemindRequestPayload = 'all',
  ): Promise<RemindResponse> {
    const body = typeof targetOrPayload === 'string' ? { targetType: targetOrPayload } : targetOrPayload;
    try {
      return this.unwrap<RemindResponse>(await firstValueFrom(this.http.post(`${this.baseUrl}/posts/${postId}/remind`, body)));
    } catch {
      return { remindedCount: 110, cooldownMinutes: 30 };
    }
  }

  // 6. Thống kê người nhận bài viết
  async getPostRecipientSummary(postId: string): Promise<PostRecipientSummary> {
    try {
      return this.unwrap<PostRecipientSummary>(
        await firstValueFrom(this.http.get(`${this.baseUrl}/posts/${postId}/recipients/summary`)),
      );
    } catch {
      return SEED_POST_UNIT_BREAKDOWN.summary;
    }
  }

  async getPostDepartmentBreakdown(postId: string): Promise<PostUnitBreakdownResponse> {
    try {
      return this.unwrap<PostUnitBreakdownResponse>(
        await firstValueFrom(this.http.get(`${this.baseUrl}/posts/${postId}/recipients/units`)),
      );
    } catch {
      return SEED_POST_UNIT_BREAKDOWN;
    }
  }

  async getPostRecipients(postId: string, status?: string, search?: string): Promise<PostRecipientsResponse> {
    try {
      let params = new HttpParams();
      if (status) params = params.set('status', status);
      if (search) params = params.set('search', search);
      return this.unwrap<PostRecipientsResponse>(
        await firstValueFrom(this.http.get(`${this.baseUrl}/posts/${postId}/recipients`, { params })),
      );
    } catch {
      let items = [...SEED_POST_RECIPIENTS.items];
      if (status) items = items.filter((u) => u.status === status);
      if (search?.trim()) {
        const kw = search.toLowerCase();
        items = items.filter(
          (u) =>
            u.fullName.toLowerCase().includes(kw) ||
            (u.unitName || '').toLowerCase().includes(kw),
        );
      }
      return { items, total: items.length };
    }
  }

  // 6.1. Chi tiết tương tác (Hearts, Shares & Track Share)
  async getPostHearts(postId: string, params?: QueryInteractionListParams): Promise<PostInteractionListResponse> {
    try {
      let httpParams = new HttpParams();
      if (params?.page) httpParams = httpParams.set('page', params.page);
      if (params?.limit) httpParams = httpParams.set('limit', params.limit);
      if (params?.before) httpParams = httpParams.set('before', params.before);
      return this.unwrap<PostInteractionListResponse>(
        await firstValueFrom(this.http.get(`${this.baseUrl}/posts/${postId}/hearts`, { params: httpParams })),
      );
    } catch {
      return { items: [], total: 0, page: 1, limit: 20, hasMore: false };
    }
  }

  async getPostShares(postId: string, params?: QueryInteractionListParams): Promise<PostInteractionListResponse> {
    try {
      let httpParams = new HttpParams();
      if (params?.page) httpParams = httpParams.set('page', params.page);
      if (params?.limit) httpParams = httpParams.set('limit', params.limit);
      if (params?.before) httpParams = httpParams.set('before', params.before);
      return this.unwrap<PostInteractionListResponse>(
        await firstValueFrom(this.http.get(`${this.baseUrl}/posts/${postId}/shares`, { params: httpParams })),
      );
    } catch {
      return { items: [], total: 0, page: 1, limit: 20, hasMore: false };
    }
  }

  async trackShare(
    postId: string,
    payload: TrackSharePayload = { source: 'web', target: 'copy_link' },
  ): Promise<TrackShareResponse> {
    try {
      return this.unwrap<TrackShareResponse>(
        await firstValueFrom(this.http.post(`${this.baseUrl}/posts/${postId}/share`, payload)),
      );
    } catch {
      return { success: true, shareCount: 1, myShareCount: 1 };
    }
  }

  // 7. Sự kiện (Register, Cancel, Summary, Remind)
  async registerEvent(postId: string, note?: string): Promise<EventMyRegistrationModel> {
    try {
      return this.unwrap<EventMyRegistrationModel>(
        await firstValueFrom(this.http.post(`${this.baseUrl}/events/${postId}/register`, { note })),
      );
    } catch {
      return { status: 'registered', registeredAt: new Date().toISOString() };
    }
  }

  async cancelEventRegistration(postId: string): Promise<void> {
    try {
      await firstValueFrom(this.http.post(`${this.baseUrl}/events/${postId}/cancel`, {}));
    } catch {}
  }

  async getEventRegistrationSummary(postId: string): Promise<EventRegistrationSummaryModel> {
    try {
      return this.unwrap<EventRegistrationSummaryModel>(
        await firstValueFrom(this.http.get(`${this.baseUrl}/events/${postId}/registrations/summary`)),
      );
    } catch {
      return { ...SEED_EVENT_REGISTRATION_SUMMARY, postId };
    }
  }

  async getEventDepartmentBreakdown(postId: string): Promise<EventDepartmentStatItem[]> {
    try {
      const data = this.unwrap<any>(
        await firstValueFrom(this.http.get(`${this.baseUrl}/events/${postId}/registrations/units`)),
      );
      return Array.isArray(data) ? data : data?.items || SEED_EVENT_DEPARTMENT_STATS;
    } catch {
      return SEED_EVENT_DEPARTMENT_STATS;
    }
  }

  async remindEventRegistration(postId: string, unitId?: string): Promise<RemindResponse> {
    try {
      return this.unwrap<RemindResponse>(
        await firstValueFrom(this.http.post(`${this.baseUrl}/events/${postId}/remind-registration`, { unitId })),
      );
    } catch {
      return { remindedCount: 52 };
    }
  }

  // 8. Bình chọn Khảo sát (Poll)
  async votePoll(postId: string, optionIds: string[]): Promise<PollModel> {
    try {
      return this.unwrap<PollModel>(
        await firstValueFrom(this.http.post(`${this.baseUrl}/posts/${postId}/poll/vote`, { optionIds })),
      );
    } catch {
      const p = SEED_POSTS_BY_CHANNEL.truyenthong[0]?.poll!;
      return {
        ...p,
        totalVotes: (p.totalVotes || 0) + 1,
        myVotedOptionIds: optionIds,
      };
    }
  }

  // 9. Sổ tay văn hóa (Handbook)
  async getHandbookToc(): Promise<HandbookTocResponse> {
    try {
      return this.unwrap<HandbookTocResponse>(await firstValueFrom(this.http.get(`${this.baseUrl}/handbook/toc`)));
    } catch {
      return SEED_HANDBOOK_TOC;
    }
  }

  async getHandbookBookmarks(): Promise<HandbookPdfBookmark[]> {
    try {
      const data = this.unwrap<any>(
        await firstValueFrom(this.http.get(`${this.baseUrl}/handbook/pdf/bookmarks`)),
      );
      return (Array.isArray(data) ? data : data?.bookmarks) || SEED_HANDBOOK_BOOKMARKS;
    } catch {
      return SEED_HANDBOOK_BOOKMARKS;
    }
  }

  get handbookPdfStreamUrl(): string {
    return '/assets/ai-social/so_tay_van_hoa.pdf';
  }

  // 10. Đơn vị được phép phát hành & Bài nháp
  async getPublishableUnits(channelCode: ChannelCode): Promise<PublishableUnitsResponse> {
    try {
      const params = new HttpParams().set('channelCode', channelCode);
      return this.unwrap<PublishableUnitsResponse>(
        await firstValueFrom(this.http.get(`${this.baseUrl}/posts/publishable-units`, { params })),
      );
    } catch {
      return { canBroadcastAll: true, units: SEED_PUBLISHABLE_UNITS };
    }
  }

  async getMyDrafts(channelCode?: ChannelCode): Promise<DraftListResponse> {
    try {
      const params = channelCode ? new HttpParams().set('channelCode', channelCode) : undefined;
      return this.unwrap<DraftListResponse>(
        await firstValueFrom(this.http.get(`${this.baseUrl}/posts/drafts`, { params })),
      );
    } catch {
      return { items: [], nextCursor: null };
    }
  }

  // 11. Presigned Upload Media S3
  async createUploadUrl(req: Record<string, any>): Promise<Record<string, any>> {
    return this.unwrap<Record<string, any>>(
      await firstValueFrom(this.http.post(`${this.baseUrl}/media/upload-url`, req)),
    );
  }

  // 12. Thông báo (Notifications)
  async getNotifications(page = 1, limit = 20): Promise<NotificationListResponse> {
    try {
      const params = new HttpParams().set('page', String(page)).set('limit', String(limit));
      return this.unwrap<NotificationListResponse>(
        await firstValueFrom(this.http.get(`${this.baseUrl}/notifications`, { params })),
      );
    } catch {
      return {
        items: SEED_NOTIFICATIONS,
        unreadCount: SEED_NOTIFICATIONS.filter((n) => !n.isSeen).length,
      };
    }
  }

  async markAllNotificationsSeen(): Promise<void> {
    try {
      await firstValueFrom(this.http.post(`${this.baseUrl}/notifications/seen`, { all: true }));
    } catch {}
  }

  async markNotificationSeen(id: string): Promise<void> {
    try {
      await firstValueFrom(this.http.post(`${this.baseUrl}/notifications/seen`, { ids: [id] }));
    } catch {}
  }
}
