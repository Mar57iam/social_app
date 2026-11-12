import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NotificationsService } from '../../core/services/notifications.service';
import { SocialNotification } from '../../core/models/notification.interface';

@Component({
  selector: 'app-notifications',
  imports: [DatePipe],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent implements OnInit {
  private readonly notificationsService = inject(NotificationsService);
  readonly pageSize = 10;
  notifications: SocialNotification[] = [];
  page = 1;
  totalPages?: number;
  unreadOnly = false;
  isLoading = false;
  isMarkingAllRead = false;
  loadFailed = false;

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.isLoading = true;
    this.loadFailed = false;
    this.notificationsService
      .getNotifications(this.unreadOnly, this.page, this.pageSize)
      .subscribe({
        next: (response) => {
          this.notifications = response.data.notifications;
          this.totalPages = response.data.pagination?.totalPages;
          this.isLoading = false;
        },
        error: () => {
          this.loadFailed = true;
          this.isLoading = false;
        },
      });
  }

  setUnreadFilter(unreadOnly: boolean): void {
    if (this.unreadOnly === unreadOnly) {
      return;
    }

    this.unreadOnly = unreadOnly;
    this.page = 1;
    this.loadNotifications();
  }

  goToPage(page: number): void {
    if (page < 1 || (this.totalPages !== undefined && page > this.totalPages)) {
      return;
    }

    this.page = page;
    this.loadNotifications();
  }

  markAsRead(notification: SocialNotification): void {
    this.notificationsService.markAsRead(notification._id).subscribe({
      next: () => {
        this.notifications = this.unreadOnly
          ? this.notifications.filter((item) => item._id !== notification._id)
          : this.notifications.map((item) =>
              item._id === notification._id ? { ...item, isRead: true, read: true } : item,
            );
        this.notificationsService.decrementUnreadCount();
      },
    });
  }

  markAllAsRead(): void {
    this.isMarkingAllRead = true;
    this.notificationsService.markAllAsRead().subscribe({
      next: () => {
        this.notifications = this.notifications.map((notification) => ({
          ...notification,
          isRead: true,
          read: true,
        }));
        this.notificationsService.clearUnreadCount();
        this.isMarkingAllRead = false;
        if (this.unreadOnly) {
          this.page = 1;
          this.loadNotifications();
        }
      },
      error: () => {
        this.isMarkingAllRead = false;
      },
    });
  }

  isUnread(notification: SocialNotification): boolean {
    return !(notification.isRead ?? notification.read ?? false);
  }

  notificationMessage(notification: SocialNotification): string {
    if (notification.message || notification.text) {
      return notification.message ?? notification.text ?? '';
    }

    const actor = notification.sender?.name ?? notification.user?.name ?? 'Someone';
    const action = notification.type?.toLowerCase();
    if (action?.includes('like')) {
      return `${actor} liked your post`;
    }
    if (action?.includes('comment')) {
      return `${actor} commented on your post`;
    }
    if (action?.includes('follow')) {
      return `${actor} started following you`;
    }
    return `${actor} sent you a notification`;
  }

}
