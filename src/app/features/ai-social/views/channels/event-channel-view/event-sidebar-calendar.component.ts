import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { UpcomingScheduleDayGroup, UpcomingScheduleEventItem } from '../../../../../core/models/ai-social-extended.models';

export interface CalendarDayCell {
  day: number | null;
  dateKey: string;
  dots: string[];
  isToday?: boolean;
}

@Component({
  selector: 'app-event-sidebar-calendar',
  standalone: true,
  imports: [],
  templateUrl: './event-sidebar-calendar.component.html',
  styleUrls: ['./event-sidebar-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventSidebarCalendarComponent {
  readonly scheduleGroups = input<UpcomingScheduleDayGroup[]>([]);
  readonly selectedDateKey = input<string>('');
  readonly dateSelected = output<string>();
  readonly scheduleEventClicked = output<UpcomingScheduleEventItem>();

  readonly currentMonth = signal<number>(11);
  readonly currentYear = signal<number>(2026);

  readonly weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  readonly legends = [
    { label: 'Sự kiện', color: '#0057E5' },
    { label: 'Thông báo / Nghỉ lễ', color: '#B00810' },
    { label: 'Đào tạo nội bộ', color: '#F66200' },
    { label: 'Tech Talk', color: '#5F31D3' },
  ];

  readonly yearMonths = [
    { month: 1, label: 'Tháng 1', count: 2, level: 'low' },
    { month: 2, label: 'Tháng 2', count: 4, level: 'med' },
    { month: 3, label: 'Tháng 3', count: 3, level: 'low' },
    { month: 4, label: 'Tháng 4', count: 5, level: 'high' },
    { month: 5, label: 'Tháng 5', count: 2, level: 'low' },
    { month: 6, label: 'Tháng 6', count: 6, level: 'high' },
    { month: 7, label: 'Tháng 7', count: 3, level: 'med' },
    { month: 8, label: 'Tháng 8', count: 4, level: 'med' },
    { month: 9, label: 'Tháng 9', count: 5, level: 'high' },
    { month: 10, label: 'Tháng 10', count: 7, level: 'high' },
    { month: 11, label: 'Tháng 11', count: 6, level: 'high' },
    { month: 12, label: 'Tháng 12', count: 4, level: 'med' },
  ];

  readonly calendarCells = computed<CalendarDayCell[]>(() => {
    const year = this.currentYear();
    const month = this.currentMonth();
    const firstDay = new Date(year, month - 1, 1).getDay();
    const leadingEmpty = (firstDay + 6) % 7;
    const daysInMonth = new Date(year, month, 0).getDate();

    const dotMap: Record<number, string[]> =
      month === 11
        ? {
            7: ['#B00810', '#F66200'],
            8: ['#B00810'],
            15: ['#F66200', '#5F31D3'],
            25: ['#0057E5'],
            30: ['#B00810'],
          }
        : {
            15: ['#0057E5'],
            21: ['#0057E5'],
          };

    const cells: CalendarDayCell[] = [];
    for (let i = 0; i < leadingEmpty; i++) {
      cells.push({ day: null, dateKey: `empty-${i}`, dots: [] });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dd = String(d).padStart(2, '0');
      const mm = String(month).padStart(2, '0');
      cells.push({
        day: d,
        dateKey: `${dd}/${mm}/${year}`,
        dots: dotMap[d] || [],
        isToday: d === 15 && month === 11,
      });
    }
    return cells;
  });

  prevMonth(): void {
    if (this.currentMonth() === 1) {
      this.currentMonth.set(12);
      this.currentYear.update((y) => y - 1);
    } else {
      this.currentMonth.update((m) => m - 1);
    }
  }

  nextMonth(): void {
    if (this.currentMonth() === 12) {
      this.currentMonth.set(1);
      this.currentYear.update((y) => y + 1);
    } else {
      this.currentMonth.update((m) => m + 1);
    }
  }

  selectDay(cell: CalendarDayCell): void {
    if (!cell.day) return;
    const next = this.selectedDateKey() === cell.dateKey ? '' : cell.dateKey;
    this.dateSelected.emit(next);
  }

  selectMonthFromHeatmap(m: number): void {
    this.currentMonth.set(m);
  }
}
