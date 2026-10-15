import { DatePipe } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideZonelessChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withRouterConfig } from '@angular/router';
import { vi as vietnam } from 'date-fns/locale';
import { provideNzDateFnsAdapter } from 'ng-zorro-antd/core/time';
import { NZ_DATE_LOCALE, NZ_I18N, vi_VN } from 'ng-zorro-antd/i18n';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { routes } from './app.routes';
import { aiSocialAuthInterceptor } from './core/interceptors/ai-social-auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideAnimations(),
    provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' })),
    provideHttpClient(withInterceptors([aiSocialAuthInterceptor])),
    { provide: NZ_I18N, useValue: vi_VN },
    { provide: NZ_DATE_LOCALE, useValue: vietnam },
    provideNzDateFnsAdapter(),
    DatePipe,
    importProvidersFrom(NzModalModule),
  ],
};
