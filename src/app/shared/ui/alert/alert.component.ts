import { Component, inject } from '@angular/core';
import { AlertService } from './alert.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  template: `
    @if (alertService.message(); as message) {
      <div
        role="alert"
        aria-live="assertive"
        class="fixed right-4 top-20 z-[100] flex max-w-sm items-start gap-3 rounded-xl border border-red-200 bg-white p-4 text-sm text-red-700 shadow-lg"
      >
        <i class="fa-solid fa-circle-exclamation mt-0.5" aria-hidden="true"></i>
        <p class="flex-1">{{ message }}</p>
        <button
          type="button"
          aria-label="Dismiss alert"
          class="text-red-500 hover:text-red-700"
          (click)="alertService.dismiss()"
        >
          <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
      </div>
    }
  `,
})
export class AlertComponent {
  protected readonly alertService = inject(AlertService);
}
