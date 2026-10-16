import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, catchError, throwError } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthSessionService } from '../services/auth-session.service';

/**
 * Interceptor tự động bóc tách vỏ dữ liệu { success: true, data: T } của Backend NestJS
 * và xử lý tập trung các mã trạng thái HTTP bất thường (401, 403, 500).
 */
export const aiSocialResponseInterceptor: HttpInterceptorFn = (req, next) => {
  const session = inject(AuthSessionService);
  const router = inject(Router);
  const message = inject(NzMessageService);

  return next(req).pipe(
    map((event) => {
      // Tự động unwrap envelope { success: true, statusCode: 200, data: ... }
      if (event instanceof HttpResponse && event.body && typeof event.body === 'object') {
        const bodyObj = event.body as Record<string, any>;
        if ('success' in bodyObj && 'data' in bodyObj) {
          return event.clone({ body: bodyObj['data'] });
        }
      }
      return event;
    }),
    catchError((error: HttpErrorResponse) => {
      // Xử lý hết hạn token (401 Unauthorized)
      if (error.status === 401) {
        if (!req.url.includes('/auth/gcn/') && !req.url.includes('/auth/exchange')) {
          message.warning('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.');
          session.clearAll();
          router.navigate(['/login']);
        }
      } else if (error.status === 403) {
        message.error('Bạn không có quyền thực hiện chức năng này.');
      } else if (error.status >= 500) {
        const errorMsg = error.error?.message || 'Máy chủ gặp sự cố xử lý. Vui lòng thử lại sau.';
        message.error(errorMsg);
      }
      return throwError(() => error);
    }),
  );
};
