import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, input, untracked } from '@angular/core';

@Component({
  selector: 'app-icon, [appIcon], [app-icon]',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (ext() === 'svg' && !showRoot()) {
      <span
        class="icon-mask app-icon-svg"
        [style.width.px]="size()"
        [style.height.px]="size()"
        [style.--icon-url]="'url(' + resolvedPath() + ')'"
        [style.--app-icon-color]="customClass().trim() ? null : 'var(--icon-color, currentColor)'"
      ></span>
    } @else {
      <img
        [src]="resolvedPath()"
        [alt]="name()"
        [style.width.px]="size()"
        [style.height.px]="size()"
        class="app-icon-img"
      />
    }
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: inherit;
    }
    .icon-mask {
      display: inline-block;
      background-color: var(--app-icon-color, currentColor);
      mask-image: var(--icon-url);
      -webkit-mask-image: var(--icon-url);
      mask-size: contain;
      -webkit-mask-size: contain;
      mask-position: center;
      -webkit-mask-position: center;
      mask-repeat: no-repeat;
      -webkit-mask-repeat: no-repeat;
    }
    .app-icon-img {
      display: inline-block;
      object-fit: contain;
    }
  `],
})
export class AppIcon {
  readonly name = input.required<string>();
  readonly ext = input<'svg' | 'png' | 'jpg'>('svg');
  readonly size = input<number>(20);
  readonly customClass = input<string>('');
  readonly autoColor = input<boolean>(true);
  readonly showRoot = input<boolean>(false);
  readonly folder = input<'icons' | 'ai-social'>('icons');

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly appliedCustomClasses = new Set<string>();

  resolvedPath(): string {
    const base = this.folder() === 'ai-social' ? 'assets/ai-social' : 'assets/images/icons';
    return `${base}/${this.name()}.${this.ext()}`;
  }

  constructor() {
    effect(() => {
      const classList = this.elementRef.nativeElement.classList;
      this.appliedCustomClasses.forEach((cls) => classList.remove(cls));
      this.appliedCustomClasses.clear();
      const customClass = this.customClass();
      untracked(() => {
        if (!this.autoColor()) {
          classList.add('no-color');
        }
        customClass
          .split(/\s+/)
          .filter(Boolean)
          .forEach((cls) => {
            classList.add(cls);
            this.appliedCustomClasses.add(cls);
          });
      });
    });
  }
}
