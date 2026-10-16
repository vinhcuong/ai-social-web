import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DateTime } from 'luxon';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { storageKey } from '../../core/constants/storage-keys';
import { AiSocialAuthService } from '../../core/services/ai-social-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NzInputModule, NzButtonComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly authService = inject(AiSocialAuthService);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);

  phoneNumber = '';
  readonly isLoading = signal(false);

  async onSubmitPhone(): Promise<void> {
    const cleanPhone = this.phoneNumber.trim();
    if (!/^0\d{9}$/.test(cleanPhone)) {
      this.message.warning('Vui lòng nhập số điện thoại hợp lệ (10 chữ số, bắt đầu bằng số 0).');
      return;
    }

    this.isLoading.set(true);
    try {
      await this.authService.sendOtp(cleanPhone);
      localStorage.setItem(storageKey.phone, cleanPhone);
      localStorage.setItem(storageKey.otpCreateDate, DateTime.now().toISO()!);
      await this.router.navigate(['/otp'], { queryParams: { phone: cleanPhone } });
    } catch (err: any) {
      const msg =
        err?.error?.error?.message ||
        err?.error?.message ||
        'Không thể gửi mã OTP. Vui lòng kiểm tra lại số điện thoại.';
      this.message.error(msg);
    } finally {
      this.isLoading.set(false);
    }
  }
}
