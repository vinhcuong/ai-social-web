import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthSessionService } from '../services/auth-session.service';

export const aiSocialAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const session = inject(AuthSessionService);

  // Skip public auth and external S3 presigned PUT requests
  if (
    req.url.includes('/auth/gcn/') ||
    req.url.includes('/auth/exchange') ||
    req.url.includes('X-Amz-Signature')
  ) {
    return next(req);
  }

  const token = session.aiSocialToken();
  if (token && req.url.includes('/api/v1')) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(cloned);
  }

  return next(req);
};
