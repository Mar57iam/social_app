import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ProfileComponent } from './profile.component';
import { PostsService } from '../../core/services/posts.service';
import { UsersService } from '../../core/services/users.service';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let postsService: jasmine.SpyObj<PostsService>;
  let usersService: jasmine.SpyObj<UsersService>;

  beforeEach(async () => {
    postsService = jasmine.createSpyObj<PostsService>('PostsService', ['getAllPosts']);
    postsService.getAllPosts.and.returnValue(of({ data: { posts: [] } }));
    usersService = jasmine.createSpyObj<UsersService>('UsersService', ['getProfileData', 'uploadProfilePhoto']);
    usersService.getProfileData.and.returnValue(of({
      data: {
        user: {
          _id: 'user-1',
          name: 'Mariam Ahmed',
          username: 'mariam',
          bio: 'Hello there',
          email: 'mariam@example.com',
          dateOfBirth: '2003-07-05T00:00:00.000Z',
          gender: 'female',
          followersCount: 0,
          followingCount: 0,
          bookmarksCount: 0,
        },
      },
    }));

    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        { provide: UsersService, useValue: usersService },
        { provide: PostsService, useValue: postsService },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads the profile from the profile data endpoint', () => {
    expect(usersService.getProfileData).toHaveBeenCalled();
    expect(postsService.getAllPosts).toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Mariam Ahmed');
    expect(fixture.nativeElement.textContent).toContain('Hello there');
    expect(fixture.nativeElement.textContent).toContain('mariam@example.com');
    expect(fixture.nativeElement.textContent).toContain('No posts yet');
  });
});
