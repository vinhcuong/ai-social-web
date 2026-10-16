import { ChannelCode } from '../constants/storage-keys';

export interface GcnUser {
  user_id: string;
  user_code?: string;
  user_firstName?: string;
  user_middleName?: string;
  user_lastName?: string;
  user_phoneNumber?: string;
  user_email?: string;
  user_avatar?: string;
  user_avatar_thumb?: string;
  user_cus_id?: string;
  full_name?: string;
}

export interface GcnAccount {
  acc_id: string;
  user_id: string;
  acc_phoneNumber: string;
  acc_status?: number;
  acc_has_accept_terms?: boolean;
}

export interface GcnVerifyOtpResponse {
  user?: GcnUser;
  account?: GcnAccount;
  token?: string;
  refreshToken?: string;
  error?: {
    message?: string;
    errors?: Array<{ message?: string }>;
  };
}

export interface EmployeeUnitInfo {
  id: string;
  code: string;
  name: string;
  path?: string;
}

export interface EmployeeTenantInfo {
  id: string;
  code: string;
  name: string;
}

export interface EmployeeProfile {
  id: string;
  code: string;
  fullName: string;
  email?: string;
  status: string;
  avatarUrl?: string;
  unit?: EmployeeUnitInfo;
  tenant?: EmployeeTenantInfo;
}

export interface RbacPermissions {
  isTenantAdmin?: boolean;
  canPublishChannels?: ChannelCode[];
  publisherChannels?: string[];
  canReviewChannels?: ChannelCode[];
  canBroadcastEmergency?: boolean;
  khanTypes?: string[];
  sotayTypes?: string[];
  statsScopePaths?: string[];
  roles?: Array<
    | string
    | {
        role: string;
        channelCode?: string | null;
        unitId?: string | null;
      }
  >;
}

export interface ExchangeTokenResponse {
  accessToken: string;
  expiresIn: number;
  employee: {
    id: string;
    code: string;
    fullName: string;
    email?: string;
    unitId?: string;
    tenantId: string;
    tenantCode: string;
    tenantName: string;
  };
}

export interface MeResponse {
  user: EmployeeProfile;
  permissions: RbacPermissions;
}
