import {
  ChangeDetectionStrategy, Component, computed, effect, model, output, signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';

export interface CalendarDayItem {
  dayNumber: number;
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

const WEEKDAY_HEADERS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const VIETNAMESE_DAYS = ['chủ nhật', 'thứ 2', 'thứ 3', 'thứ 4', 'thứ 5', 'thứ 6', 'thứ 7'];

@Component({
  selector: 'app-post-schedule-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NzModalModule],
  templateUrl: './post-schedule-modal.component.html',
  styleUrl: './post-schedule-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostScheduleModalComponent {
  readonly visible = model<boolean>(false);
  readonly initialDate = model<Date | null>(null);

  readonly scheduleConfirmed = output<Date>();
  readonly scheduleCleared = output<void>();

  readonly selectedDate = signal<Date>(new Date(Date.now() + 3600 * 1000));
  readonly viewYear = signal<number>(new Date().getFullYear());
  readonly viewMonth = signal<number>(new Date().getMonth());

  readonly showCalendarPopover = signal<boolean>(false);
  readonly showTimePopover = signal<boolean>(false);

  readonly weekdayHeaders = WEEKDAY_HEADERS;
  readonly hoursList = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  readonly minutesList = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  constructor() {
    effect(() => {
      if (this.visible()) {
        const init = this.initialDate();
        const base = init ? new Date(init) : new Date(Date.now() + 3600 * 1000);
        this.selectedDate.set(base);
        this.viewYear.set(base.getFullYear());
        this.viewMonth.set(base.getMonth());
        this.showCalendarPopover.set(false);
        this.showTimePopover.set(false);
      }
    }, { allowSignalWrites: true });
  }

  readonly currentHour = computed(() => String(this.selectedDate().getHours()).padStart(2, '0'));
  readonly currentMinute = computed(() => String(this.selectedDate().getMinutes()).padStart(2, '0'));
  readonly currentDay = computed(() => String(this.selectedDate().getDate()).padStart(2, '0'));
  readonly currentMonth = computed(() => String(this.selectedDate().getMonth() + 1).padStart(2, '0'));
  readonly currentYear = computed(() => String(this.selectedDate().getFullYear()));

  readonly dynamicScheduleText = computed(() => {
    const d = this.selectedDate();
    const dayOfWeek = VIETNAMESE_DAYS[d.getDay()];
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    const ss = '00';
    return `Sẽ gửi về ${dayOfWeek}, ${dd}/${mm}/${yyyy} lúc ${hh}:${min}:${ss}`;
  });

  readonly calendarDays = computed<CalendarDayItem[]>(() => {
    const year = this.viewYear();
    const month = this.viewMonth();
    const firstDay = new Date(year, month, 1);
    const dayOfWeek = (firstDay.getDay() + 6) % 7; // Monday = 0
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    const today = new Date();
    const currentSel = this.selectedDate();

    const items: CalendarDayItem[] = [];
    // Previous month padding
    for (let i = dayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthDays - i);
      items.push({
        dayNumber: d.getDate(),
        date: d,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
      });
    }
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      const isToday = d.toDateString() === today.toDateString();
      const isSelected = d.toDateString() === currentSel.toDateString();
      items.push({
        dayNumber: day,
        date: d,
        isCurrentMonth: true,
        isToday,
        isSelected,
      });
    }
    // Next month padding to complete grid
    const remaining = (7 - (items.length % 7)) % 7;
    for (let day = 1; day <= remaining; day++) {
      const d = new Date(year, month + 1, day);
      items.push({
        dayNumber: day,
        date: d,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
      });
    }
    return items;
  });

  prevMonth(): void {
    const m = this.viewMonth();
    if (m === 0) {
      this.viewMonth.set(11);
      this.viewYear.update((y) => y - 1);
    } else {
      this.viewMonth.update((v) => v - 1);
    }
  }

  nextMonth(): void {
    const m = this.viewMonth();
    if (m === 11) {
      this.viewMonth.set(0);
      this.viewYear.update((y) => y + 1);
    } else {
      this.viewMonth.update((v) => v + 1);
    }
  }

  selectCalendarDay(item: CalendarDayItem): void {
    const curr = this.selectedDate();
    const next = new Date(item.date);
    next.setHours(curr.getHours(), curr.getMinutes(), 0, 0);
    this.selectedDate.set(next);
    this.showCalendarPopover.set(false);
  }

  setTime(hourStr: string, minStr: string): void {
    const next = new Date(this.selectedDate());
    next.setHours(Number(hourStr), Number(minStr), 0, 0);
    this.selectedDate.set(next);
  }

  onConfirm(): void {
    this.scheduleConfirmed.emit(this.selectedDate());
    this.visible.set(false);
  }

  onClearSchedule(): void {
    this.scheduleCleared.emit();
    this.visible.set(false);
  }
}
