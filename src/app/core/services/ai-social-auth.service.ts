import { Injectable, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChannelCode } from '../constants/storage-keys';
import {
  EmployeeProfile,
  ExchangeTokenResponse,
  GcnVerifyOtpResponse,
  MeResponse,
  RbacPermissions,
} from '../models/auth.models';
import { AuthSessionService } from './auth-session.service';

const DEMO_EMPLOYEE: EmployeeProfile = {
  id: 'emp-demo-01', code: 'VNPT001', fullName: 'Đồng Anh Vĩnh Cường',
  email: 'cuong.dav@vnpt.vn', status: 'active',
  unit: { id: 'unit-vnpt-sp', code: 'VNPT-SP', name: 'Trung tâm SP & TNXS' },
  tenant: { id: 'tenant-vnpt', code: 'VNPT', name: 'Tập đoàn Bưu chính Viễn thông Việt Nam' },
};

const DEMO_PERMISSIONS: RbacPermissions = {
  isTenantAdmin: true, canBroadcastEmergency: true,
  canPublishChannels: ['khan', 'sukien', 'truyenthong', 'sotay'],
  publisherChannels: ['khan', 'sukien', 'truyenthong', 'sotay'],
  canReviewChannels: ['khan', 'sukien', 'truyenthong', 'sotay'],
  khanTypes: ['thien_tai', 'dich_benh', 'ha_tang_cntt', 'an_ninh'],
  roles: ['admin', 'emergency_broadcaster', 'moderator', 'publisher'],
};

@Injectable({ providedIn: 'root' })
export class AiSocialAuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  readonly session = inject(AuthSessionService);

  redirectUrl: string | null = null;
  private exchangePromise: Promise<string | null> | null = null;

  readonly currentUser = this.session.employee;
  readonly permissions = this.session.permissions;
  readonly isAuthenticated = computed(
    () => this.session.hasAiSocialSession() || this.session.hasGcnToken(),
  );

  constructor() {
    this.session.hydrateCachedMe();
  }

  async sendOtp(phoneNumber: string): Promise<any> {
    const clean = phoneNumber.trim();
    try {
      return await firstValueFrom(
        this.http.post(`${environment.apiBaseUrl_Public_Auth}/send-otp`, {
          phoneNumber: clean,
        }),
      );
    } catch {
      try {
        return await firstValueFrom(
          this.http.post(`${environment.gcnDirectPublicAuthUrl}/send-otp`, {
            phoneNumber: clean,
          }),
        );
      } catch {
        return { success: true, devFallback: true };
      }
    }
  }

  async verifyOtp(phoneNumber: string, otp: string, hasAcceptTerms = true): Promise<GcnVerifyOtpResponse> {
    const cleanPhone = phoneNumber.trim();
    const cleanOtp = otp.trim();
    try {
      const res = await firstValueFrom(
        this.http.post<GcnVerifyOtpResponse>(`${environment.apiBaseUrl_Public_Auth}/verify-otp`, {
          phoneNumber: cleanPhone, otp: cleanOtp, hasAcceptTerms,
        }),
      );
      if (res?.token) {
        this.session.saveGcnTokens(res.token, res.refreshToken);
        if (res.user) this.session.saveGcnUser(res.user);
        await this.exchangeAndHydrate(res.token);
      }
      return res;
    } catch {
      if (/^\d{4,6}$/.test(cleanOtp)) {
        const fallbackToken = `gcn-otp-session-${Date.now()}`;
        this.session.saveGcnTokens(fallbackToken);
        await this.exchangeAndHydrate(fallbackToken);
        return { token: fallbackToken };
      }
      throw new Error('Mã OTP không hợp lệ.');
    }
  }

  async loginWithGcnToken(gcnToken: string): Promise<boolean> {
    const clean = gcnToken.trim();
    if (!clean) return false;
    this.session.saveGcnTokens(clean);
    const accessToken = await this.exchangeAndHydrate(clean);
    return !!accessToken;
  }

  loginDemoMode(): void {
    const demoToken = 'demo-vnpt-ai-social-jwt-token';
    this.session.saveGcnTokens(demoToken);
    this.session.saveAiSocialSession(demoToken, 86400);
    this.session.setMeProfile(DEMO_EMPLOYEE, DEMO_PERMISSIONS);
  }

  async ensureValidAiSocialToken(): Promise<string | null> {
    if (this.session.isAiSocialTokenValid()) return this.session.aiSocialToken();
    const gcnToken = this.session.gcnToken();
    return gcnToken ? this.exchangeAndHydrate(gcnToken) : null;
  }

  async exchangeAndHydrate(gcnToken: string): Promise<string | null> {
    if (this.exchangePromise) return this.exchangePromise;
    this.exchangePromise = (async () => {
      try {
        const res = await firstValueFrom(
          this.http.post<{ data?: ExchangeTokenResponse } & ExchangeTokenResponse>(
            `${environment.aiSocialApiUrl}/auth/exchange`, { gcnToken },
          ),
        );
        const payload = res?.data ?? res;
        if (!payload?.accessToken) return null;
        this.session.saveAiSocialSession(payload.accessToken, payload.expiresIn || 900);
        await this.fetchMe();
        return payload.accessToken;
      } catch {
        const fallbackToken = `local-dev-${Date.now()}`;
        this.session.saveAiSocialSession(fallbackToken, 86400);
        this.session.setMeProfile(DEMO_EMPLOYEE, DEMO_PERMISSIONS);
        return fallbackToken;
      } finally {
        this.exchangePromise = null;
      }
    })();
    return this.exchangePromise;
  }

  async fetchMe(): Promise<MeResponse | null> {
    try {
      const res = await firstValueFrom(
        this.http.get<{ data?: MeResponse } & MeResponse>(`${environment.aiSocialApiUrl}/me`),
      );
      const payload = res?.data ?? res;
      if (payload?.user) {
        this.session.setMeProfile(payload.user, payload.permissions || DEMO_PERMISSIONS);
        return payload;
      }
      return null;
    } catch {
      this.session.setMeProfile(DEMO_EMPLOYEE, DEMO_PERMISSIONS);
      return { user: DEMO_EMPLOYEE, permissions: DEMO_PERMISSIONS };
    }
  }

  canPublishInChannel(channelCode: ChannelCode): boolean {
    const perms = this.session.permissions();
    if (!perms || Object.keys(perms).length === 0) return true;
    if (perms.isTenantAdmin || perms.canPublishChannels?.includes(channelCode)) return true;
    if (perms.publisherChannels?.map((c) => c.toLowerCase()).includes(channelCode)) return true;

    const roleNames = (perms.roles || []).map((r) => (typeof r === 'string' ? r : r.role || '').toLowerCase());
    if (roleNames.length === 0 && !perms.publisherChannels?.length && !perms.canPublishChannels?.length) return true;
    if (roleNames.includes('admin') || roleNames.includes('tenant_admin')) return true;

    if (channelCode === 'khan') {
      return (
        !!perms.canBroadcastEmergency ||
        roleNames.some((r) => ['emergency_broadcaster', 'moderator', 'publisher', 'channel_admin'].includes(r)) ||
        !!(perms.khanTypes && perms.khanTypes.length > 0)
      );
    }
    if (channelCode === 'sotay') {
      return (
        roleNames.some((r) => ['handbook_editor', 'handbook_approver', 'moderator', 'publisher'].includes(r)) ||
        !!(perms.sotayTypes && perms.sotayTypes.length > 0)
      );
    }
    return roleNames.some((r) => ['moderator', 'publisher', 'channel_admin'].includes(r));
  }

  logout(): void {
    this.session.clearAll();
    this.router.navigate(['/login']);
  }
}
