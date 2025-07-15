import { TestBed } from '@angular/core/testing';
import { ThemeService } from './ThemeService';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('should set and toggle theme correctly', () => {
    service.toggleTheme(); 
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');

    service.toggleTheme(); 
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('should apply saved theme on init', () => {
    localStorage.setItem('theme', 'dark');
    const newService = new ThemeService();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
