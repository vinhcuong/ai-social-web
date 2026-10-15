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

@Injectable({
  providedIn: 'root',
})
export class AiSocialApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.aiSocialApiUrl;

  get handbookPdfStreamUrl(): string {
    return `${this.baseUrl}/handbook/pdf/stream`;
  }

  private unwrap<T>(res: any): T {
    return (res?.data !== undefined ? res.data : res) as T;
  }

  async getChannelPosts(
    channelCode: ChannelCode,
    opts?: { limit?: number; before?: string; search?: string; categoryCode?: string; chapterCode?: string },
  ): Promise<PostFeedResponse> {
    let params = new HttpParams();
    if (opts?.limit) params = params.set('limit', opts.limit);
    if (opts?.before) params = params.set('before', opts.before);
    if (opts?.search) params = params.set('search', opts.search);
    if (opts?.categoryCode) params = params.set('categoryCode', opts.categoryCode);
    if (opts?.chapterCode) params = params.set('chapterCode', opts.chapterCode);
    const res = await firstValueFrom(this.http.get(`${this.baseUrl}/channels/${channelCode}/posts`, { params }));
    return this.unwrap<PostFeedResponse>(res);
  }

  async getChannelCategories(channelCode: ChannelCode): Promise<ChannelCategoryModel[]> {
    const res = await firstValueFrom(this.http.get(`${this.baseUrl}/channels/${channelCode}/categories`));
    return this.unwrap<ChannelCategoryModel[]>(res) || [];
  }

  async getBadges(): Promise<BadgeCounts> {
    const res = await firstValueFrom(this.http.get(`${this.baseUrl}/me/badges`));
    return this.unwrap<BadgeCounts>(res);
  }

  async getMyProgress(): Promise<MyProgressResponse> {
    const res = await firstValueFrom(this.http.get(`${this.baseUrl}/me/progress`));
    return this.unwrap<MyProgressResponse>(res);
  }

  async markRead(postId: string, ackVersion = 1): Promise<any> {
    const res = await firstValueFrom(this.http.post(`${this.baseUrl}/posts/${postId}/read`, { ackVersion }));
    return this.unwrap(res);
  }

  async toggleHeart(postId: string): Promise<{ isHearted?: boolean; heartCount?: number }> {
    const res = await firstValueFrom(this.http.put(`${this.baseUrl}/posts/${postId}/heart`, {}));
    return this.unwrap(res);
  }

  async getPostDetail(postId: string): Promise<PostModel> {
    const res = await firstValueFrom(this.http.get(`${this.baseUrl}/posts/${postId}`));
    return this.unwrap<PostModel>(res);
  }

  async getPostByCode(code: string): Promise<PostModel> {
    const res = await firstValueFrom(this.http.get(`${this.baseUrl}/posts/by-code/${code}`));
    return this.unwrap<PostModel>(res);
  }

  async getHandbookToc(): Promise<HandbookTocResponse> {
    const res = await firstValueFrom(this.http.get(`${this.baseUrl}/channels/sotay/toc`));
    return this.unwrap<HandbookTocResponse>(res);
  }

  async getHandbookPdfBookmarks(): Promise<HandbookPdfBookmark[]> {
    const res = await firstValueFrom(this.http.get(`${this.baseUrl}/handbook/pdf/bookmarks`));
    return this.unwrap<HandbookPdfBookmark[]>(res) || [];
  }

  async getPostSummary(postId: string): Promise<PostRecipientSummary> {
    const res = await firstValueFrom(this.http.get(`${this.baseUrl}/posts/${postId}/recipients/summary`));
    return this.unwrap<PostRecipientSummary>(res);
  }

  async remindPost(postId: string, targetType = 'all', customMessage?: string): Promise<any> {
    const res = await firstValueFrom(
      this.http.post(`${this.baseUrl}/posts/${postId}/remind`, {
        targetType,
        ...(customMessage ? { customMessage } : {}),
      }),
    );
    return this.unwrap(res);
  }

  async getNotifications(page = 1, limit = 20): Promise<NotificationListResponse> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    const res = await firstValueFrom(this.http.get(`${this.baseUrl}/notifications`, { params }));
    return this.unwrap<NotificationListResponse>(res);
  }

  async markNotificationsSeen(opts: { ids?: string[]; all?: boolean }): Promise<void> {
    await firstValueFrom(this.http.post(`${this.baseUrl}/notifications/seen`, opts));
  }

  async getPublishableUnits(channelCode: ChannelCode): Promise<PublishableUnitsResponse> {
    const params = new HttpParams().set('channelCode', channelCode);
    const res = await firstValueFrom(this.http.get(`${this.baseUrl}/posts/publishable-units`, { params }));
    return this.unwrap<PublishableUnitsResponse>(res);
  }

  async createPost(body: Record<string, any>): Promise<PostModel> {
    const res = await firstValueFrom(this.http.post(`${this.baseUrl}/posts`, body));
    return this.unwrap<PostModel>(res);
  }

  async updatePost(postId: string, body: Record<string, any>): Promise<PostModel> {
    const res = await firstValueFrom(this.http.put(`${this.baseUrl}/posts/${postId}`, body));
    return this.unwrap<PostModel>(res);
  }

  async deletePost(postId: string): Promise<any> {
    const res = await firstValueFrom(this.http.delete(`${this.baseUrl}/posts/${postId}`));
    return this.unwrap(res);
  }

  async setPostPinned(postId: string, isPinned: boolean): Promise<any> {
    const res = await firstValueFrom(this.http.put(`${this.baseUrl}/posts/${postId}/pin`, { isPinned }));
    return this.unwrap(res);
  }

  async endEmergencyPost(postId: string): Promise<any> {
    const res = await firstValueFrom(this.http.post(`${this.baseUrl}/posts/${postId}/end`, {}));
    return this.unwrap(res);
  }

  async votePoll(postId: string, optionIds: string[]): Promise<PollModel> {
    const res = await firstValueFrom(this.http.post(`${this.baseUrl}/posts/${postId}/poll/vote`, { optionIds }));
    return this.unwrap<PollModel>(res);
  }

  async registerEvent(postId: string, note?: string): Promise<EventMyRegistrationModel> {
    const res = await firstValueFrom(this.http.post(`${this.baseUrl}/events/${postId}/register`, note ? { note } : {}));
    return this.unwrap<EventMyRegistrationModel>(res);
  }

  async cancelEventRegistration(postId: string, reason?: string): Promise<any> {
    const res = await firstValueFrom(
      this.http.post(`${this.baseUrl}/events/${postId}/cancel`, reason ? { cancellationReason: reason } : {}),
    );
    return this.unwrap(res);
  }

  async createUploadUrl(body: {
    filename: string;
    mimeType: string;
    sizeBytes: number;
    channelCode: ChannelCode;
    kind?: string;
    purpose?: string;
  }): Promise<{ uploadUrl: string; mediaId?: string; id?: string; s3Key?: string; fileUrl?: string }> {
    const res = await firstValueFrom(
      this.http.post(`${this.baseUrl}/media/upload-url`, {
        filename: body.filename,
        mimeType: body.mimeType,
        contentType: body.mimeType,
        sizeBytes: body.sizeBytes,
        fileSize: body.sizeBytes,
        channelCode: body.channelCode,
        kind: body.kind,
        purpose: body.purpose ?? (body.channelCode == 'sotay' ? 'handbook_pdf' : 'post_attachment'),
      }),
    );
    return this.unwrap(res);
  }
}
