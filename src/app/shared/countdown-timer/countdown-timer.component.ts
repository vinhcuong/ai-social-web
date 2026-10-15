import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, input, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-countdown-timer',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountdownTimerComponent implements OnInit, OnDestroy {
  readonly startTime = input<number>(0);
  readonly countdown = input<boolean>(true);
  readonly format = input<string>('ms');

  readonly onTick = output<{ tick_count: number }>();

  readonly remainingTime = signal<number>(0);
  private timerId: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.remainingTime.set(this.startTime());
    this.start();
  }

  start(): void {
    this.stop();
    this.timerId = setInterval(() => {
      if (this.remainingTime() > 0) {
        const next = this.remainingTime() - 1;
        this.remainingTime.set(next);
        this.onTick.emit({ tick_count: next });
      } else {
        this.stop();
      }
    }, 1000);
  }

  stop(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  restart(startTime: number = this.startTime()): void {
    this.reset(startTime);
    this.start();
  }

  reset(startTime: number = this.startTime()): void {
    this.stop();
    this.remainingTime.set(startTime);
    this.onTick.emit({ tick_count: startTime });
  }

  ngOnDestroy(): void {
    this.stop();
  }
}
