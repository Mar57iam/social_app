import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { LeftSidebarComponent } from './left-sidebar.component';
import { UsersService } from '../../../../core/services/users.service';

describe('LeftSidebarComponent', () => {
  let component: LeftSidebarComponent;
  let fixture: ComponentFixture<LeftSidebarComponent>;
  let router: jasmine.SpyObj<Router>;
  let usersService: jasmine.SpyObj<UsersService>;

  beforeEach(async () => {
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    usersService = jasmine.createSpyObj<UsersService>('UsersService', ['getProfileData']);
    usersService.getProfileData.and.returnValue(of({
      data: {
        user: { _id: 'user-1', name: 'Mariam', username: 'mariam', photo: 'profile.jpg' },
      },
    }));

    await TestBed.configureTestingModule({
      imports: [LeftSidebarComponent],
      providers: [
        { provide: Router, useValue: router },
        { provide: UsersService, useValue: usersService },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeftSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the signed-in user photo and name', () => {
    expect(fixture.nativeElement.textContent).toContain('Mariam');
    expect(fixture.nativeElement.querySelector('img')?.getAttribute('src')).toBe('profile.jpg');
  });
});
