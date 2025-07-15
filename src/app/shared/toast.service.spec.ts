import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ToastService } from './ToastService';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a toast message', () => {
    service.show('Test Title', 'Test Message', true);
    const toasts = service.getToasts();
    expect(toasts.length).toBe(1);
    expect(toasts[0]).toEqual({ title: 'Test Title', msg: 'Test Message', isWarning: true });
  });

 
  it('should remove the toast after 5 seconds', fakeAsync(() => {
    service.show('Auto Remove', 'This will disappear');
    expect(service.getToasts().length).toBe(1);

    tick(5000);
    expect(service.getToasts().length).toBe(0);
  }));

  it('should clear all toasts', () => {
    service.show('One', 'Message One');
    service.show('Two', 'Message Two');
    expect(service.getToasts().length).toBe(2);

    service.clear();
    expect(service.getToasts().length).toBe(0);
  });
});
