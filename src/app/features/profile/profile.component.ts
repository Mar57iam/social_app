import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Post } from '../../core/models/post.interface';
import { PostsService } from '../../core/services/posts.service';
import { ProfileDataResponse, UserProfile, UsersService } from '../../core/services/users.service';
import { PostCardComponent } from '../feed/components/post-card/post-card.component';

@Component({
  selector: 'app-profile',
  imports: [PostCardComponent, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private readonly usersService = inject(UsersService);
  private readonly postsService = inject(PostsService);

  profile: UserProfile | null = null;
  posts: Post[] = [];
  isLoading = true;
  hasError = false;
  isLoadingPosts = false;
  postsError = false;
  isUploadingPhoto = false;
  photoUploadError = '';

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.hasError = false;
    this.usersService.getProfileData().subscribe({
      next: (response) => {
        this.profile = this.extractProfile(response);
        this.hasError = !this.profile;
        this.isLoading = false;
        if (this.profile) {
          this.loadPosts();
        }
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      },
    });
  }

  get displayName(): string {
    return this.profile?.name || this.profile?.fullName || this.profile?.username || 'Your profile';
  }

  get profilePhoto(): string | null {
    return this.profile?.photo || this.profile?.profilePhoto || this.profile?.avatar || null;
  }

  get initials(): string {
    return this.displayName
      .split(/[\s._-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('');
  }

  get joinedDate(): string | null {
    return this.formatDate(this.profile?.createdAt, { month: 'short', year: 'numeric' });
  }

  get birthDate(): string | null {
    return this.formatDate(this.profile?.dateOfBirth, { month: 'long', day: 'numeric', year: 'numeric' });
  }

  get genderLabel(): string | null {
    if (!this.profile?.gender) {
      return null;
    }
    return this.profile.gender.charAt(0).toUpperCase() + this.profile.gender.slice(1);
  }

  get followerCount(): number {
    return this.profile?.followersCount ?? this.profile?.followers?.length ?? 0;
  }

  get followingCount(): number {
    return this.profile?.followingCount ?? this.profile?.following?.length ?? 0;
  }

  get bookmarkCount(): number {
    return this.profile?.bookmarksCount ?? this.profile?.bookmarks?.length ?? 0;
  }

  loadPosts(): void {
    const userId = this.profile?._id;
    if (!userId) {
      this.posts = [];
      return;
    }

    this.isLoadingPosts = true;
    this.postsError = false;
    this.postsService.getAllPosts().subscribe({
      next: (response) => {
        const allPosts: Post[] = response?.data?.posts ?? [];
        this.posts = allPosts.filter((post) => post.user?._id === userId);
        this.isLoadingPosts = false;
      },
      error: () => {
        this.postsError = true;
        this.isLoadingPosts = false;
      },
    });
  }

  private formatDate(value: string | undefined, options: Intl.DateTimeFormatOptions): string | null {
    if (!value) {
      return null;
    }
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : new Intl.DateTimeFormat('en', options).format(date);
  }

  uploadPhoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    const photo = input.files?.[0];
    input.value = '';
    if (!photo) {
      return;
    }

    this.photoUploadError = '';
    if (!photo.type.startsWith('image/')) {
      this.photoUploadError = 'Choose an image file to upload.';
      return;
    }

    this.isUploadingPhoto = true;
    this.usersService.uploadProfilePhoto(photo).subscribe({
      next: (response) => {
        const updatedProfile = this.extractProfile(response);
        if (updatedProfile && (updatedProfile.photo || updatedProfile.profilePhoto || updatedProfile.avatar)) {
          this.profile = { ...(this.profile ?? {}), ...updatedProfile };
        } else {
          this.loadProfile();
        }
        this.isUploadingPhoto = false;
      },
      error: () => {
        this.photoUploadError = 'Could not update your photo. Please try again.';
        this.isUploadingPhoto = false;
      },
    });
  }

  private extractProfile(response: ProfileDataResponse): UserProfile | null {
    const data = response.data;
    if (data) {
      return data.user ?? data.profile ?? data.profileData ?? data.userData ?? data;
    }

    return response.user ?? response.profile ?? null;
  }
}
