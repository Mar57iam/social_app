import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SuggestedUser {
  _id: string;
  name?: string;
  username?: string;
  photo?: string | null;
}

export interface SuggestionsResponse {
  data?: SuggestedUser[] | {
    suggestions?: SuggestedUser[];
    users?: SuggestedUser[];
    suggestedUsers?: SuggestedUser[];
  };
  suggestions?: SuggestedUser[];
  users?: SuggestedUser[];
}

export interface UserProfile {
  _id?: string;
  name?: string;
  fullName?: string;
  username?: string;
  email?: string;
  bio?: string;
  photo?: string | null;
  cover?: string | null;
  profilePhoto?: string | null;
  avatar?: string | null;
  dateOfBirth?: string;
  gender?: string;
  followers?: unknown[];
  following?: unknown[];
  bookmarks?: unknown[];
  followersCount?: number;
  followingCount?: number;
  bookmarksCount?: number;
  createdAt?: string;
}

export interface ProfileDataWrapper {
  user?: UserProfile;
  profile?: UserProfile;
  profileData?: UserProfile;
  userData?: UserProfile;
}

export interface ProfileDataResponse {
  data?: UserProfile & ProfileDataWrapper;
  user?: UserProfile;
  profile?: UserProfile;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly httpClient = inject(HttpClient);

  getSuggestions(limit = 10): Observable<SuggestionsResponse> {
    return this.httpClient.get<SuggestionsResponse>(`${environment.baseUrl}/users/suggestions`, {
      params: { limit },
    });
  }

  getProfileData(): Observable<ProfileDataResponse> {
    return this.httpClient.get<ProfileDataResponse>(`${environment.baseUrl}/users/profile-data`);
  }

  uploadProfilePhoto(photo: File): Observable<ProfileDataResponse> {
    const formData = new FormData();
    formData.append('photo', photo);
    return this.httpClient.put<ProfileDataResponse>(`${environment.baseUrl}/users/upload-photo`, formData);
  }
}
