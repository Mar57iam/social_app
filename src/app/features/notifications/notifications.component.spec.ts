import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { NotificationsService } from '../../core/services/notifications.service';
import { NotificationsComponent } from './notifications.component';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;

  beforeEach(async () => {
    const notificationsService = jasmine.createSpyObj<NotificationsService>(
      'NotificationsService',
      ['getNotifications', 'markAsRead', 'markAllAsRead', 'decrementUnreadCount', 'clearUnreadCount'],
    );
    notificationsService.getNotifications.and.returnValue(of({ data: { notifications: [] } }));

    await TestBed.configureTestingModule({
      imports: [NotificationsComponent],
      providers: [{ provide: NotificationsService, useValue: notificationsService }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
