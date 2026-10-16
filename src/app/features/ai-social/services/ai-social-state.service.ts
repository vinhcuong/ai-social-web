import { Injectable, computed, inject, signal } from '@angular/core';
import { ChannelCode } from '../../../core/constants/storage-keys';
import {
  BadgeCounts,
  ChannelCategoryModel,
  HandbookTocChapter,
  MyProgressResponse,
  NotificationItem,
  PostModel,
} from '../../../core/models/ai-social.models';
import { UpcomingScheduleDayGroup } from '../../../core/models/ai-social-extended.models';
import { AiSocialApiService } from './ai-social-api.service';
import { SEED_BADGE_COUNTS, SEED_UPCOMING_SCHEDULE } from './ai-social-seed-meta.data';
import { SEED_ACTIVE_EMERGENCY_POST } from './ai-social-seed-posts.data';
import { AiSocialSocketService } from './ai-social-socket.service';

@Injectable({
  providedIn: 'root',
})
export class AiSocialStateService {
  private readonly api = inject(AiSocialApiService);
  private readonly socket = inject(AiSocialSocketService);

  readonly activeChannel = signal<ChannelCode>('truyenthong');
  readonly badges = signal<BadgeCounts>({ ...SEED_BADGE_COUNTS });
  readonly myProgress = signal<MyProgressResponse | null>(null);
  readonly notifications = signal<NotificationItem[]>([]);
  readonly unreadNotificationCount = signal<number>(2);

  readonly syncedEmergencyPost = signal<PostModel | null>(SEED_ACTIVE_EMERGENCY_POST);
  readonly upcomingSchedule = signal<UpcomingScheduleDayGroup[]>(SEED_UPCOMING_SCHEDULE);

  readonly posts = signal<PostModel[]>([]);
  readonly loadingPosts = signal<boolean>(false);
  readonly hasMorePosts = signal<boolean>(false);
  readonly nextCursor = signal<string | null>(null);

  readonly categories = signal<ChannelCategoryModel[]>([]);
  readonly selectedCategory = signal<string>('');
  readonly searchQuery = signal<string>('');

  readonly handbookChapters = signal<HandbookTocChapter[]>([]);
  readonly loadingHandbook = signal<boolean>(false);

  readonly activeEmergencyPost = computed(() => {
    const fromFeed = this.posts().find(
      (p) => p.channelCode === 'khan' && p.status === 'published' && !p.isRead && !p.endedAt,
    );
    return fromFeed || this.syncedEmergencyPost();
  });

  constructor() {
    this.bindRealtimeEvents();
  }

  initRealtime(): void {
    this.socket.connect();
    this.refreshBadges();
    this.refreshMyProgress();
    this.refreshNotifications();
  }

  private bindRealtimeEvents(): void {
    this.socket.badgeInvalidated$.subscribe(() => {
      this.refreshBadges();
      this.refreshMyProgress();
    });

    this.socket.postPublished$.subscribe((rawPost) => {
      this.refreshBadges();
      if (rawPost?.['channelCode'] === this.activeChannel()) {
        this.loadChannelPosts(this.activeChannel(), false);
      }
    });

    this.socket.postUpdated$.subscribe((rawPost) => {
      const updatedId = rawPost?.['id'];
      if (!updatedId) return;
      this.posts.update((list) =>
        list.map((p) => (p.id === updatedId ? ({ ...p, ...rawPost } as PostModel) : p)),
      );
    });

    this.socket.postEnded$.subscribe((postId) => {
      this.posts.update((list) =>
        list.map((p) =>
          p.id === postId ? { ...p, status: 'ended', endedAt: new Date().toISOString() } : p,
        ),
      );
      if (this.syncedEmergencyPost()?.id === postId) {
        this.syncedEmergencyPost.set(null);
      }
    });

    this.socket.notificationNew$.subscribe(() => {
      this.refreshNotifications();
      this.refreshBadges();
    });
  }

  async refreshBadges(): Promise<void> {
    try {
      const syncData = await this.api.getSync();
      if (syncData?.badges) this.badges.set(syncData.badges);
      if (syncData?.activeEmergency !== undefined) {
        this.syncedEmergencyPost.set(syncData.activeEmergency);
      }
    } catch {
      const counts = await this.api.getBadges();
      if (counts) this.badges.set(counts);
    }
  }

  async refreshMyProgress(): Promise<void> {
    try {
      const prog = await this.api.getMyProgress();
      if (prog) this.myProgress.set(prog);
    } catch {}
  }

  async refreshNotifications(): Promise<void> {
    try {
      const res = await this.api.getNotifications(1, 20);
      this.notifications.set(res?.items || []);
      this.unreadNotificationCount.set(
        res?.unreadCount ?? (res?.items || []).filter((n) => !n.isSeen).length,
      );
    } catch {}
  }

  async loadChannelPosts(channelCode: ChannelCode, resetFilter = true): Promise<void> {
    this.activeChannel.set(channelCode);
    if (resetFilter) {
      this.selectedCategory.set('');
      this.searchQuery.set('');
    }
    this.loadingPosts.set(true);
    try {
      const [feed, cats] = await Promise.all([
        this.api.getChannelPosts(channelCode, {
          limit: 20,
          categoryCode: this.selectedCategory() || undefined,
          search: this.searchQuery().trim() || undefined,
        }),
        this.api.getChannelCategories(channelCode).catch(() => []),
      ]);
      this.posts.set(feed?.items || []);
      this.hasMorePosts.set(!!feed?.hasMore);
      this.nextCursor.set(feed?.nextCursor || null);
      this.categories.set(cats || []);
    } finally {
      this.loadingPosts.set(false);
    }
  }

  async loadMorePosts(): Promise<void> {
    const cursor = this.nextCursor();
    if (!this.hasMorePosts() || !cursor || this.loadingPosts()) return;

    this.loadingPosts.set(true);
    try {
      const feed = await this.api.getChannelPosts(this.activeChannel(), {
        limit: 20,
        before: cursor,
        categoryCode: this.selectedCategory() || undefined,
        search: this.searchQuery().trim() || undefined,
      });
      this.posts.update((prev) => [...prev, ...(feed?.items || [])]);
      this.hasMorePosts.set(!!feed?.hasMore);
      this.nextCursor.set(feed?.nextCursor || null);
    } finally {
      this.loadingPosts.set(false);
    }
  }

  async loadHandbookToc(): Promise<void> {
    this.loadingHandbook.set(true);
    try {
      const res = await this.api.getHandbookToc();
      this.handbookChapters.set(res?.chapters || []);
    } finally {
      this.loadingHandbook.set(false);
    }
  }

  updatePostInList(updated: PostModel): void {
    this.posts.update((list) => list.map((p) => (p.id === updated.id ? updated : p)));
    if (this.syncedEmergencyPost()?.id === updated.id) {
      this.syncedEmergencyPost.set(updated);
    }
  }

  prependPost(created: PostModel): void {
    this.posts.update((list) => [created, ...list.filter((p) => p.id !== created.id)]);
  }

  removePostFromList(postId: string): void {
    this.posts.update((list) => list.filter((p) => p.id !== postId));
  }
}
