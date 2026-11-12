import { Component, inject, input, OnInit } from '@angular/core';
import { SuggestedUser, SuggestionsResponse, UsersService } from '../../../../core/services/users.service';

@Component({
  selector: 'app-right-sidebar',
  imports: [],
  templateUrl: './right-sidebar.component.html',
  styleUrl: './right-sidebar.component.css',
})
export class RightSidebarComponent implements OnInit {
  private readonly usersService = inject(UsersService);

  sticky = input(true);
  suggestions: SuggestedUser[] = [];
  isLoading = true;
  hasError = false;

  ngOnInit(): void {
    this.loadSuggestions();
  }

  loadSuggestions(): void {
    this.isLoading = true;
    this.hasError = false;
    this.usersService.getSuggestions(10).subscribe({
      next: (response) => {
        this.suggestions = this.extractSuggestions(response);
        this.isLoading = false;
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      },
    });
  }

  private extractSuggestions(response: SuggestionsResponse): SuggestedUser[] {
    const data = response.data;
    if (Array.isArray(data)) {
      return data;
    }

    return data?.suggestions
      ?? data?.users
      ?? data?.suggestedUsers
      ?? response.suggestions
      ?? response.users
      ?? [];
  }
}
