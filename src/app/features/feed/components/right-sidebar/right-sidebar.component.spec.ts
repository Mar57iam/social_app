import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { RightSidebarComponent } from './right-sidebar.component';
import { UsersService } from '../../../../core/services/users.service';

describe('RightSidebarComponent', () => {
  let component: RightSidebarComponent;
  let fixture: ComponentFixture<RightSidebarComponent>;
  let usersService: jasmine.SpyObj<UsersService>;

  beforeEach(async () => {
    usersService = jasmine.createSpyObj<UsersService>('UsersService', ['getSuggestions']);
    usersService.getSuggestions.and.returnValue(of({
      data: {
        suggestions: [{ _id: 'user-1', name: 'Suggested Person', username: 'suggested_person' }],
      },
    }));

    await TestBed.configureTestingModule({
      imports: [RightSidebarComponent],
      providers: [{ provide: UsersService, useValue: usersService }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(RightSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads and displays suggested users', () => {
    expect(usersService.getSuggestions).toHaveBeenCalledWith(10);
    expect(fixture.nativeElement.textContent).toContain('Suggested Person');
    expect(fixture.nativeElement.textContent).toContain('@suggested_person');
  });
});
