import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'theme';

  constructor() {
    this.loadInitialTheme();
  }

  toggleTheme(): void {
    const isDark = this.getCurrentTheme() === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(this.THEME_KEY, newTheme);
  }

  getCurrentTheme(): 'light' | 'dark' {
    return (localStorage.getItem(this.THEME_KEY) as 'light' | 'dark') || 'light';
  }

  private loadInitialTheme(): void {
    const savedTheme = this.getCurrentTheme();
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
}