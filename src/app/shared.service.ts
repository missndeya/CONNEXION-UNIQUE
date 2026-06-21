import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
}

@Injectable({ providedIn: 'root' })
export class SharedService {
  private readonly _toast = signal<ToastMessage | null>(null);
  readonly toast = this._toast.asReadonly();

  private dismissTimer: ReturnType<typeof setTimeout> | null = null;

  showToast(message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'info'): void {
    if (this.dismissTimer) clearTimeout(this.dismissTimer);
    this._toast.set({ message, type });
    this.dismissTimer = setTimeout(() => this._toast.set(null), 10000);
  }

  clearToast(): void {
    if (this.dismissTimer) clearTimeout(this.dismissTimer);
    this._toast.set(null);
  }
}
