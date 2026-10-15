import { Injectable, computed, signal } from '@angular/core';
import { storageKey } from '../constants/storage-keys';
import { EmployeeProfile, GcnUser, RbacPermissions } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthSessionService {
  private readonly _gcnToken = signal<string | null>(this.read(storageKey.token));
  private readonly _gcnRefreshToken = signal<string | null>(this.read(storageKey.refToken));
  private readonly _aiSocialToken = signal<string | null>(this.read(storageKey.aiSocialToken));
  private readonly _aiSocialExpiry = signal<string | null>(this.read(storageKey.aiSocialTokenExpiry));
  private readonly _gcnUser = signal<GcnUser | null>(this.readJson<GcnUser>(storageKey.user));
  private readonly _employee = signal<EmployeeProfile | null>(null);
  private readonly _permissions = signal<RbacPermissions | null>(null);

  readonly gcnToken = this._gcnToken.asReadonly();
  readonly gcnRefreshToken = this._gcnRefreshToken.asReadonly();
  readonly aiSocialToken = this._aiSocialToken.asReadonly();
  readonly gcnUser = this._gcnUser.asReadonly();
  readonly employee = this._employee.asReadonly();
  readonly permissions = this._permissions.asReadonly();

  readonly hasGcnToken = computed(() => !!this._gcnToken());
  readonly hasAiSocialSession = computed(() => !!this._aiSocialToken());

  saveGcnTokens(token: string, refreshToken?: string): void {
    localStorage.setItem(storageKey.token, token);
    this._gcnToken.set(token);
    if (refreshToken) {
      localStorage.setItem(storageKey.refToken, refreshToken);
      this._gcnRefreshToken.set(refreshToken);
    }
  }

  saveGcnUser(user: GcnUser): void {
    localStorage.setItem(storageKey.user, JSON.stringify(user));
    this._gcnUser.set(user);
  }

  saveAiSocialSession(accessToken: string, expiresInSeconds = 900): void {
    const expiryIso = new Date(Date.now() + expiresInSeconds * 1000).toISOString();
    localStorage.setItem(storageKey.aiSocialToken, accessToken);
    localStorage.setItem(storageKey.aiSocialTokenExpiry, expiryIso);
    this._aiSocialToken.set(accessToken);
    this._aiSocialExpiry.set(expiryIso);
  }

  setMeProfile(employee: EmployeeProfile, permissions: RbacPermissions): void {
    const gcnAvatar = this._gcnUser()?.user_avatar_thumb || this._gcnUser()?.user_avatar;
    const mergedEmployee: EmployeeProfile = {
      ...employee,
      avatarUrl: employee.avatarUrl || gcnAvatar,
    };
    this._employee.set(mergedEmployee);
    this._permissions.set(permissions);
    localStorage.setItem(
      storageKey.aiSocialMe,
      JSON.stringify({ user: mergedEmployee, permissions }),
    );
  }

  hydrateCachedMe(): void {
    const cached = this.readJson<{ user: EmployeeProfile; permissions: RbacPermissions }>(
      storageKey.aiSocialMe,
    );
    if (cached?.user) {
      this._employee.set(cached.user);
      this._permissions.set(cached.permissions || {});
    }
  }

  isAiSocialTokenValid(): boolean {
    const token = this._aiSocialToken();
    const expiry = this._aiSocialExpiry();
    if (!token || !expiry) return false;
    return Date.now() + 15000 < new Date(expiry).getTime();
  }

  clearAll(): void {
    Object.values(storageKey).forEach((key) => localStorage.removeItem(key));
    this._gcnToken.set(null);
    this._gcnRefreshToken.set(null);
    this._aiSocialToken.set(null);
    this._aiSocialExpiry.set(null);
    this._gcnUser.set(null);
    this._employee.set(null);
    this._permissions.set(null);
  }

  private read(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private readJson<T>(key: string): T | null {
    const raw = this.read(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }
}
