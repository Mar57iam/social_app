import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileDataResponse, UserProfile, UsersService } from '../../../../core/services/users.service';

@Component({
  selector: 'app-left-sidebar',
  imports: [],
  templateUrl: './left-sidebar.component.html',
  styleUrl: './left-sidebar.component.css',
})
export class LeftSidebarComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly usersService = inject(UsersService);

  profile = this.readStoredUser();
  profilePhotoFailed = false;

  ngOnInit(): void {
    this.usersService.getProfileData().subscribe({
      next: (response) => {
        this.profile = this.extractProfile(response);
        this.profilePhotoFailed = false;
      },
    });
  }

  get displayName(): string {
    return this.profile?.name || this.profile?.fullName || this.profile?.username || 'Your profile';
  }

  onProfilePhotoError(): void {
    this.profilePhotoFailed = true;
  }

  openProfile(): void {
    void this.router.navigate(['/profile']);
  }

  private readStoredUser(): UserProfile | null {
    try {
      return JSON.parse(localStorage.getItem('user') ?? 'null') as UserProfile | null;
    } catch {
      return null;
    }
  }

  private extractProfile(response: ProfileDataResponse): UserProfile | null {
    const data = response.data;
    if (data) {
      return data.user ?? data.profile ?? data.profileData ?? data.userData ?? data;
    }
    return response.user ?? response.profile ?? this.readStoredUser();
  }
}
