import { Injectable, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChannelCode } from '../constants/storage-keys';
import {
  ExchangeTokenResponse,
  GcnVerifyOtpResponse,
  MeResponse,
} from '../models/auth.models';
import { AuthSessionService } from './auth-session.service';

@Injectable({
  providedIn: 'root',
})
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
    return firstValueFrom(
      this.http.post(`${environment.apiBaseUrl_Public_Auth}/send-otp`, {
        phoneNumber: phoneNumber.trim(),
      }),
    );
  }

  async verifyOtp(
    phoneNumber: string,
    otp: string,
    hasAcceptTerms = true,
  ): Promise<GcnVerifyOtpResponse> {
    const res = await firstValueFrom(
      this.http.post<GcnVerifyOtpResponse>(
        `${environment.apiBaseUrl_Public_Auth}/verify-otp`,
        {
          phoneNumber: phoneNumber.trim(),
          otp: otp.trim(),
          hasAcceptTerms,
        },
      ),
    );
    if (res?.token) {
      this.session.saveGcnTokens(res.token, res.refreshToken);
      if (res.user) {
        this.session.saveGcnUser(res.user);
      }
      await this.exchangeAndHydrate(res.token);
    }
    return res;
  }

  async loginWithGcnToken(gcnToken: string): Promise<boolean> {
    const clean = gcnToken.trim();
    if (!clean) return false;
    this.session.saveGcnTokens(clean);
    const accessToken = await this.exchangeAndHydrate(clean);
    return !!accessToken;
  }

  async ensureValidAiSocialToken(): Promise<string | null> {
    if (this.session.isAiSocialTokenValid()) {
      return this.session.aiSocialToken();
    }
    const gcnToken = this.session.gcnToken();
    if (!gcnToken) return null;
    return this.exchangeAndHydrate(gcnToken);
  }

  async exchangeAndHydrate(gcnToken: string): Promise<string | null> {
    if (this.exchangePromise) {
      return this.exchangePromise;
    }
    this.exchangePromise = (async () => {
      try {
        const res = await firstValueFrom(
          this.http.post<{ data?: ExchangeTokenResponse } & ExchangeTokenResponse>(
            `${environment.aiSocialApiUrl}/auth/exchange`,
            { gcnToken },
          ),
        );
        const payload = res?.data ?? res;
        if (!payload?.accessToken) return null;

        this.session.saveAiSocialSession(payload.accessToken, payload.expiresIn || 900);
        await this.fetchMe();
        return payload.accessToken;
      } catch (err) {
        console.error('AI Social token exchange failed:', err);
        return null;
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
        this.session.setMeProfile(payload.user, payload.permissions || {});
        return payload;
      }
      return null;
    } catch (err) {
      console.error('Failed to fetch /api/v1/me:', err);
      return null;
    }
  }

  canPublishInChannel(channelCode: ChannelCode): boolean {
    const perms = this.session.permissions();
    if (!perms) return false;
    if (perms.isTenantAdmin) return true;
    if (channelCode === 'khan' && perms.canBroadcastEmergency) return true;
    if (perms.canPublishChannels?.includes(channelCode)) return true;
    return (
      perms.roles?.some(
        (r) =>
          r.role === 'TENANT_ADMIN' ||
          r.role === 'EMERGENCY_BROADCASTER' ||
          ((r.role === 'CHANNEL_ADMIN' || r.role === 'PUBLISHER') &&
            (!r.channelCode || r.channelCode === channelCode)),
      ) ?? false
    );
  }

  logout(): void {
    this.session.clearAll();
    this.router.navigate(['/login']);
  }
}
