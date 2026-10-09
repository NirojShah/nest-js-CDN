import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly storageKey = 'cdn-theme';
  readonly isDark = signal(this.getStoredTheme() === 'dark');

  constructor() {
    this.applyTheme(this.isDark() ? 'dark' : 'light');
  }

  toggle(): void {
    const theme = this.isDark() ? 'light' : 'dark';
    this.isDark.set(theme === 'dark');
    this.applyTheme(theme);
    this.document.defaultView?.localStorage.setItem(this.storageKey, theme);
  }

  private getStoredTheme(): Theme | null {
    const theme = this.document.defaultView?.localStorage.getItem(this.storageKey);
    return theme === 'dark' || theme === 'light' ? theme : null;
  }

  private applyTheme(theme: Theme): void {
    this.document.documentElement.setAttribute('data-theme', theme);
  }
}
