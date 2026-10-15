import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal, viewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DateTime } from 'luxon';
import { NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzTypographyComponent } from 'ng-zorro-antd/typography';
import { storageKey } from '../../core/constants/storage-keys';
import { AiSocialAuthService } from '../../core/services/ai-social-auth.service';
import { CountdownTimerComponent } from '../../shared/countdown-timer/countdown-timer.component';
import { AppIcon } from '../../shared/icon/icon';

@Component({
  selector: 'app-otp-auth',
  standalone: true,
  imports: [
    FormsModule,
    NzFormDirective,
    NzFormItemComponent,
    NzFormLabelComponent,
    NzFormControlComponent,
    NzInputModule,
    NzCheckboxComponent,
    NzButtonComponent,
    NzTypographyComponent,
    CountdownTimerComponent,
    AppIcon,
  ],
  templateUrl: './otp-auth.component.html',
  styleUrls: ['./otp-auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpAuthComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly titleService = inject(Title);
  private readonly authService = inject(AiSocialAuthService);
  private readonly responsive = inject(BreakpointObserver);

  private readonly otpExpireSeconds = 120;

  readonly phoneNumber = signal('');
  readonly phoneNumberHide = signal('');
  readonly otp = signal('');
  readonly isCheckedButton = signal(true);
  readonly isLoggingIn = signal(false);
  readonly errorMsg = signal('');
  readonly timer = signal<number>(120);
  readonly tick = signal<number>(120);
  readonly isMobile = signal(false);

  readonly timerChild = viewChild(CountdownTimerComponent);

  ngOnInit(): void {
    this.titleService.setTitle('Xác thực OTP | VNPT AI Social');
    const savedPhone = localStorage.getItem(storageKey.phone) ?? '';
    if (!savedPhone) {
      this.router.navigate(['/login']);
      return;
    }
    this.phoneNumber.set(savedPhone);
    this.phoneNumberHide.set(
      savedPhone.length > 4 ? `${savedPhone.slice(0, -4)}****` : savedPhone,
    );

    const remaining = this.getOtpRemainingSeconds();
    this.timer.set(remaining);
    this.tick.set(remaining);

    this.responsive
      .observe([Breakpoints.XSmall, Breakpoints.Tablet])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.isMobile.set(result.matches);
      });
  }

  getOtpRemainingSeconds(): number {
    const saved = localStorage.getItem(storageKey.otpCreateDate);
    if (!saved) return this.otpExpireSeconds;
    const created = DateTime.fromISO(saved);
    const diff = DateTime.now().diff(created, 'seconds').seconds;
    return Math.max(0, Math.floor(this.otpExpireSeconds - diff));
  }

  onTick(event: { tick_count: number }): void {
    this.tick.set(event.tick_count);
  }

  onClickBack(): void {
    this.timerChild()?.reset();
    this.location.back();
  }

  async onResendOtp(): Promise<void> {
    if (!navigator.onLine) {
      this.errorMsg.set('Không có kết nối Internet! Vui lòng kiểm tra lại kết nối!');
      return;
    }
    this.isLoggingIn.set(true);
    this.errorMsg.set('');
    try {
      await this.authService.sendOtp(this.phoneNumber());
      localStorage.setItem(storageKey.otpCreateDate, DateTime.now().toISO()!);
      this.timer.set(this.otpExpireSeconds);
      this.tick.set(this.otpExpireSeconds);
      this.timerChild()?.restart(this.otpExpireSeconds);
    } catch (e: any) {
      this.errorMsg.set(
        e?.error?.message || e?.error?.errors?.[0]?.message || e?.message || 'Lỗi gửi lại OTP.',
      );
    } finally {
      this.isLoggingIn.set(false);
    }
  }

  async submitForm(): Promise<void> {
    if (this.tick() === 0) {
      this.errorMsg.set('Mã OTP đã hết hạn! Vui lòng bấm Gửi lại mã OTP.');
      return;
    }
    if (!this.otp().trim()) {
      this.errorMsg.set('Vui lòng nhập mã OTP 6 chữ số!');
      return;
    }
    if (!navigator.onLine) {
      this.errorMsg.set('Không có kết nối Internet! Vui lòng kiểm tra lại kết nối!');
      return;
    }

    this.errorMsg.set('');
    this.isLoggingIn.set(true);
    try {
      const loginResult = await this.authService.verifyOtp(
        this.phoneNumber(),
        this.otp(),
        this.isCheckedButton(),
      );
      if (loginResult?.error || !loginResult?.token) {
        this.errorMsg.set(
          loginResult?.error?.message ||
            loginResult?.error?.errors?.[0]?.message ||
            'Mã OTP không chính xác hoặc đã hết hạn.',
        );
        return;
      }

      if (!this.authService.session.hasAiSocialSession()) {
        this.errorMsg.set(
          'Tài khoản GoConnect chưa được ánh xạ mã nhân viên trên hệ thống VNPT AI Social.',
        );
        return;
      }

      const redirect = this.authService.redirectUrl || '/channels/truyenthong';
      this.authService.redirectUrl = null;
      await this.router.navigateByUrl(redirect);
    } catch (e: any) {
      this.errorMsg.set(
        e?.error?.message || e?.message || 'Xác thực OTP thất bại. Vui lòng thử lại.',
      );
    } finally {
      this.isLoggingIn.set(false);
    }
  }
}
