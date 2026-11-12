import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private readonly currentMessage = signal<string | null>(null);
  readonly message = this.currentMessage.asReadonly();
  private dismissTimer: ReturnType<typeof setTimeout> | undefined;

  showError(message: string): void {
    this.currentMessage.set(message);
    clearTimeout(this.dismissTimer);
    this.dismissTimer = setTimeout(() => this.dismiss(), 5000);
  }

  dismiss(): void {
    clearTimeout(this.dismissTimer);
    this.dismissTimer = undefined;
    this.currentMessage.set(null);
  }
}
