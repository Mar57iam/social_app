import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  NotificationsResponse,
  UnreadCountResponse,
} from '../models/notification.interface';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private readonly httpClient = inject(HttpClient);
  private readonly currentUnreadCount = signal(0);
  readonly unreadCount = this.currentUnreadCount.asReadonly();

  getNotifications(unread: boolean, page: number, limit: number): Observable<NotificationsResponse> {
    const params = new HttpParams()
      .set('unread', unread)
      .set('page', page)
      .set('limit', limit);

    return this.httpClient.get<NotificationsResponse>(
      `${environment.baseUrl}/notifications`,
      { params },
    );
  }

  getUnreadCount(): Observable<UnreadCountResponse> {
    return this.httpClient.get<UnreadCountResponse>(
      `${environment.baseUrl}/notifications/unread-count`,
    );
  }

  markAsRead(notificationId: string): Observable<unknown> {
    return this.httpClient.patch(
      `${environment.baseUrl}/notifications/${notificationId}/read`,
      {},
    );
  }

  markAllAsRead(): Observable<unknown> {
    return this.httpClient.patch(`${environment.baseUrl}/notifications/read-all`, {});
  }

  setUnreadCount(count: number): void {
    this.currentUnreadCount.set(count);
  }

  decrementUnreadCount(): void {
    this.currentUnreadCount.update((count) => Math.max(0, count - 1));
  }

  clearUnreadCount(): void {
    this.currentUnreadCount.set(0);
  }
}
