import { DatePipe } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import { vi as vietnam } from 'date-fns/locale';
import { provideNzDateFnsAdapter } from 'ng-zorro-antd/core/time';
import { NZ_DATE_LOCALE, NZ_I18N, vi_VN } from 'ng-zorro-antd/i18n';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { routes } from './app.routes';
import { aiSocialAuthInterceptor } from './core/interceptors/ai-social-auth.interceptor';
import { nzIcons } from './nz-icons';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' })),
    provideHttpClient(withInterceptors([aiSocialAuthInterceptor])),
    { provide: NZ_I18N, useValue: vi_VN },
    { provide: NZ_DATE_LOCALE, useValue: vietnam },
    provideNzDateFnsAdapter(),
    provideNzIcons(nzIcons),
    DatePipe,
    importProvidersFrom(NzModalModule),
  ],
};
