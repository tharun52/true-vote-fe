import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts: { title: string; msg: string; isWarning: boolean }[] = [];

  getToasts() {
    return this.toasts;
  }

  show(title: string, msg: string, isWarning: boolean = false) {
    this.toasts.push({ title, msg, isWarning });

    setTimeout(() => this.toasts.shift(), 5000);
  }

  clear() {
    this.toasts = [];
  }
}
