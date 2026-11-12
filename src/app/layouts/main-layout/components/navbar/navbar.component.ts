import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { NotificationsService } from '../../../../core/services/notifications.service';
import { SocialNotification } from '../../../../core/models/notification.interface';


@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, DatePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthService)
  readonly notificationsService = inject(NotificationsService)

  isProfileMenuOpen = false;
  isNotificationsOpen = false;
  notificationPreview: SocialNotification[] = [];
  isLoadingNotificationPreview = false;
  notificationPreviewFailed = false;

ngOnInit(): void {
  this.notificationsService.getUnreadCount().subscribe({
    next: (response) => this.notificationsService.setUnreadCount(response.data.unreadCount),
  });
}

toggleProfileMenu() {
  this.isProfileMenuOpen = !this.isProfileMenuOpen;
}

toggleNotifications(): void {
  this.isNotificationsOpen = !this.isNotificationsOpen;
  if (this.isNotificationsOpen) {
    this.loadNotificationPreview();
  }
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

loadNotificationPreview(): void {
  this.isLoadingNotificationPreview = true;
  this.notificationPreviewFailed = false;
  this.notificationsService.getNotifications(false, 1, 5).subscribe({
    next: (response) => {
      this.notificationPreview = response.data.notifications;
      this.isLoadingNotificationPreview = false;
    },
    error: () => {
      this.notificationPreviewFailed = true;
      this.isLoadingNotificationPreview = false;
    },
  });
}

logout() :void {
  this.authService.signOut()
}

}
