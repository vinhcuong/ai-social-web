import {
  ChangeDetectionStrategy, Component, ElementRef, HostListener,
  computed, effect, inject, model, output, signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface EmojiCategory {
  id: string;
  icon: string;
  label: string;
  emojis: string[];
}

const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    id: 'smileys',
    icon: '🙂',
    label: 'Biểu cảm',
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
      '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😋', '😛', '😝',
      '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒',
      '😞', '😔', '😟', '😕', '🙁', '😣', '😖', '😫', '😩', '🥺',
      '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶',
      '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '😶',
      '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱',
    ],
  },
  {
    id: 'urgent',
    icon: '⚠️',
    label: 'Khẩn cấp & Công việc',
    emojis: [
      '⚠️', '🚨', '📢', '🔥', '⚡', '📌', '📍', '🔔', '🔕', '📣',
      '🛑', '⛔', '❌', '⭕', '‼️', '❓', '❗', 'ℹ️', '💡', '🛡️',
      '🔒', '🔓', '🔑', '🎯', '🚩', '🏁', '🚀', '⏳', '⌛', '📅',
      '📆', '🗓️', '⏰', '⏱️', '⏲️', '📊', '📈', '📉', '📋', '📎',
      '📁', '📂', '📄', '📃', '📑', '✉️', '📧', '💻', '🖥️', '📱',
    ],
  },
  {
    id: 'gestures',
    icon: '👍',
    label: 'Cử chỉ',
    emojis: [
      '👍', '👎', '👏', '🙌', '👐', '🤲', '🤝', '✍️', '💪', '👂',
      '👃', '👀', '👁️', '👅', '👄', '💋', '👤', '👥', '🫂', '👶',
      '👧', '🧒', '👦', '👩', '🧑', '👨', '👵', '👴', '👮', '👷',
    ],
  },
  {
    id: 'nature',
    icon: '🐱',
    label: 'Thiên nhiên',
    emojis: [
      '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
      '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦉', '🐺',
      '🐴', '🦄', '🐝', '🐛', '🦋', '🌲', '🌳', '🌴', '🌵', '🍀',
    ],
  },
  {
    id: 'food',
    icon: '🍔',
    label: 'Đồ ăn',
    emojis: [
      '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒',
      '🥑', '🌶️', '🌽', '🥕', '🍞', '🧀', '🍗', '🍖', '🍔', '🍟',
      '🍕', '🌮', '🍜', '🍣', '🍦', '🍩', '🎂', '☕', '🍵', '🧋',
    ],
  },
  {
    id: 'objects',
    icon: '💡',
    label: 'Đồ vật',
    emojis: [
      '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🚗', '🚕', '🚙', '🚌',
      '🚎', '🏎️', '🚓', '🚑', '🚒', '✈️', '🚀', '🛰️', '🚁', '⛵',
    ],
  },
];

@Component({
  selector: 'app-emoji-picker-popover',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './emoji-picker-popover.component.html',
  styleUrl: './emoji-picker-popover.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.placement-top]': "placement() === 'top'",
    '[class.placement-bottom]': "placement() === 'bottom'",
  },
})
export class EmojiPickerPopoverComponent {
  private readonly elRef = inject(ElementRef);

  readonly visible = model<boolean>(false);
  readonly emojiSelect = output<string>();
  readonly placement = signal<'top' | 'bottom'>('bottom');

  readonly categories = EMOJI_CATEGORIES;
  readonly activeTabId = signal<string>('smileys');
  readonly searchQuery = signal<string>('');

  constructor() {
    effect(() => {
      if (this.visible()) {
        const trigger = this.elRef.nativeElement.parentElement;
        if (trigger) {
          const rect = trigger.getBoundingClientRect();
          this.placement.set(rect.top < 380 ? 'bottom' : 'top');
        }
      }
    }, { allowSignalWrites: true });
  }

  readonly displayEmojis = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    if (q) {
      const all = this.categories.flatMap((c) => c.emojis);
      return Array.from(new Set(all));
    }
    const cat = this.categories.find((c) => c.id === this.activeTabId());
    return cat ? cat.emojis : this.categories[0].emojis;
  });

  onSelectEmoji(emoji: string, event: MouseEvent): void {
    event.stopPropagation();
    this.emojiSelect.emit(emoji);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.visible()) return;
    const clickedInside = this.elRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.visible.set(false);
    }
  }
}
