import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal, viewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DateTime } from 'luxon';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { storageKey } from '../../core/constants/storage-keys';
import { AiSocialAuthService } from '../../core/services/ai-social-auth.service';
import { CountdownTimerComponent } from '../../shared/countdown-timer/countdown-timer.component';

@Component({
  selector: 'app-otp-auth',
  standalone: true,
  imports: [FormsModule, NzButtonComponent, CountdownTimerComponent],
  templateUrl: './otp-auth.component.html',
  styleUrls: ['./otp-auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpAuthComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly titleService = inject(Title);
  private readonly authService = inject(AiSocialAuthService);
  private readonly responsive = inject(BreakpointObserver);

  private readonly otpExpireSeconds = 120;
  readonly otpIndices = [0, 1, 2, 3, 4, 5];

  readonly phoneNumber = signal('');
  readonly phoneNumberHide = signal('');
  readonly otpDigits = signal<string[]>(['', '', '', '', '', '']);
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
    const queryPhone = this.route.snapshot.queryParamMap.get('phone')?.trim() || '';
    const savedPhone = queryPhone || (localStorage.getItem(storageKey.phone) ?? '');
    if (!savedPhone) {
      this.router.navigate(['/login']);
      return;
    }
    localStorage.setItem(storageKey.phone, savedPhone);
    if (!localStorage.getItem(storageKey.otpCreateDate)) {
      localStorage.setItem(storageKey.otpCreateDate, DateTime.now().toISO()!);
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

  onDigitInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const digit = input.value.replace(/\D/g, '').slice(-1);
    input.value = digit;
    const next = [...this.otpDigits()];
    next[index] = digit;
    this.otpDigits.set(next);
    this.otp.set(next.join(''));
    this.errorMsg.set('');

    if (digit && index < 5) {
      const nextEl = document.getElementById(`otp-box-${index + 1}`) as HTMLInputElement | null;
      nextEl?.focus();
      nextEl?.select();
    }
  }

  onDigitKeyDown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.otpDigits()[index] && index > 0) {
      const prevEl = document.getElementById(`otp-box-${index - 1}`) as HTMLInputElement | null;
      prevEl?.focus();
      prevEl?.select();
    } else if (event.key === 'ArrowLeft' && index > 0) {
      document.getElementById(`otp-box-${index - 1}`)?.focus();
    } else if (event.key === 'ArrowRight' && index < 5) {
      document.getElementById(`otp-box-${index + 1}`)?.focus();
    }
  }

  onOtpPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasted = (event.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = ['', '', '', '', '', ''];
    for (let i = 0; i < 6; i++) {
      next[i] = pasted[i] || '';
    }
    this.otpDigits.set(next);
    this.otp.set(next.join(''));
    const focusIdx = Math.min(pasted.length, 5);
    document.getElementById(`otp-box-${focusIdx}`)?.focus();
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
      this.otpDigits.set(['', '', '', '', '', '']);
      this.otp.set('');
      this.timer.set(this.otpExpireSeconds);
      this.tick.set(this.otpExpireSeconds);
      this.timerChild()?.restart(this.otpExpireSeconds);
    } catch (e: any) {
      this.errorMsg.set(e?.error?.message || e?.message || 'Lỗi gửi lại OTP.');
    } finally {
      this.isLoggingIn.set(false);
    }
  }

  async submitForm(): Promise<void> {
    if (this.tick() === 0) {
      this.errorMsg.set('Mã OTP đã hết hạn! Vui lòng bấm Gửi lại mã OTP.');
      return;
    }
    if (this.otp().trim().length < 6) {
      this.errorMsg.set('Vui lòng nhập đầy đủ 6 chữ số OTP!');
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
        this.errorMsg.set(loginResult?.error?.message || 'Mã OTP không chính xác hoặc đã hết hạn.');
        return;
      }
      const redirect = this.authService.redirectUrl || '/home';
      this.authService.redirectUrl = null;
      await this.router.navigateByUrl(redirect);
    } catch (e: any) {
      this.errorMsg.set(e?.error?.message || e?.message || 'Xác thực OTP thất bại.');
    } finally {
      this.isLoggingIn.set(false);
    }
  }
}
