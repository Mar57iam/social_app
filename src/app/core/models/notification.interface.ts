export interface NotificationActor {
  _id?: string;
  name?: string;
  photo?: string;
}

export interface SocialNotification {
  _id: string;
  message?: string;
  text?: string;
  type?: string;
  sender?: NotificationActor;
  user?: NotificationActor;
  isRead?: boolean;
  read?: boolean;
  createdAt?: string;
}

export interface NotificationsResponse {
  data: {
    notifications: SocialNotification[];
    pagination?: {
      totalPages?: number;
    };
  };
}

export interface UnreadCountResponse {
  data: {
    unreadCount: number;
  };
}
