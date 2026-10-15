import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DateTime } from 'luxon';
import { NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzTypographyComponent } from 'ng-zorro-antd/typography';
import { environment } from '../../../environments/environment';
import { PHONENUMBER_REGEX, storageKey } from '../../core/constants/storage-keys';
import { AiSocialAuthService } from '../../core/services/ai-social-auth.service';
import { AppIcon } from '../../shared/icon/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NzFormDirective,
    NzFormItemComponent,
    NzFormLabelComponent,
    NzFormControlComponent,
    NzInputModule,
    NzButtonComponent,
    NzTypographyComponent,
    AppIcon,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly titleService = inject(Title);
  private readonly authService = inject(AiSocialAuthService);
  private readonly responsive = inject(BreakpointObserver);
  private readonly destroyRef = inject(DestroyRef);

  loginForm!: FormGroup;
  readonly isLoggingIn = signal(false);
  readonly formErrorMsg = signal('');
  readonly isMobile = signal(false);
  readonly isDevMode = !environment.production;
  readonly showDevTokenBox = signal(false);
  readonly devGcnToken = signal('');

  ngOnInit(): void {
    this.titleService.setTitle('Đăng nhập SĐT + OTP | VNPT AI Social');
    const savedPhone = localStorage.getItem(storageKey.phone) ?? '';
    this.loginForm = this.fb.group({
      phone: [savedPhone, [Validators.required, Validators.pattern(PHONENUMBER_REGEX)]],
    });

    const redirectParam = this.route.snapshot.queryParamMap.get('redirect');
    if (redirectParam) {
      this.authService.redirectUrl = redirectParam;
    }

    this.responsive
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.isMobile.set(result.matches);
      });
  }

  async doSendOtp(): Promise<void> {
    this.loginForm.markAllAsTouched();
    const phoneCtrl = this.loginForm.controls['phone'];
    if (!phoneCtrl.valid) {
      phoneCtrl.markAsDirty();
      phoneCtrl.updateValueAndValidity();
      return;
    }

    const phone = String(phoneCtrl.value || '').trim();
    const savedPhone = localStorage.getItem(storageKey.phone) ?? '';
    const createDateOtp = localStorage.getItem(storageKey.otpCreateDate);

    if (createDateOtp && phone === savedPhone) {
      const createdAt = DateTime.fromISO(createDateOtp);
      const diffMinutes = DateTime.now().diff(createdAt, ['minutes']).minutes;
      if (diffMinutes >= 0 && diffMinutes < 2) {
        await this.router.navigate(['/login/otp-auth']);
        return;
      }
    }

    if (!navigator.onLine) {
      this.formErrorMsg.set('Không có kết nối Internet! Vui lòng kiểm tra lại kết nối!');
      return;
    }

    this.formErrorMsg.set('');
    this.isLoggingIn.set(true);
    localStorage.setItem(storageKey.phone, phone);

    try {
      const res = await this.authService.sendOtp(phone);
      if (res?.error) {
        this.formErrorMsg.set(
          res.error.message || res.error.errors?.[0]?.message || 'Không thể gửi mã OTP.',
        );
        return;
      }
      localStorage.setItem(storageKey.otpCreateDate, DateTime.now().toISO()!);
      await this.router.navigate(['/login/otp-auth']);
    } catch (e: any) {
      this.formErrorMsg.set(
        e?.error?.message || e?.error?.errors?.[0]?.message || e?.message || 'Lỗi gửi mã OTP.',
      );
    } finally {
      this.isLoggingIn.set(false);
    }
  }

  async loginWithDevToken(): Promise<void> {
    const token = this.devGcnToken().trim();
    if (!token) {
      this.formErrorMsg.set('Vui lòng dán GoConnect JWT token.');
      return;
    }
    this.isLoggingIn.set(true);
    this.formErrorMsg.set('');
    try {
      const ok = await this.authService.loginWithGcnToken(token);
      if (!ok) {
        this.formErrorMsg.set('Token không hợp lệ hoặc không khớp nhân sự trên hệ thống.');
        return;
      }
      const target = this.authService.redirectUrl || '/channels/truyenthong';
      this.authService.redirectUrl = null;
      await this.router.navigateByUrl(target);
    } finally {
      this.isLoggingIn.set(false);
    }
  }
}
