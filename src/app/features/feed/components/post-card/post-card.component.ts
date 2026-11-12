import { Component, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Post } from '../../../../core/models/post.interface';
import { DatePipe } from '@angular/common';
import { PostsService } from '../../../../core/services/posts.service';
import { CommentListComponent } from '../comment-list/comment-list.component';
import { ConfirmDialogComponent } from '../../../../shared/ui/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-post-card',
  imports: [DatePipe, ReactiveFormsModule, CommentListComponent, ConfirmDialogComponent],

templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css',
})
export class PostCardComponent  {

  private readonly postsService = inject(PostsService);
  private readonly router = inject(Router);

  @Output() postChanged = new EventEmitter<void>();


  post = input.required<Post>();
  userId: string = JSON.parse(localStorage.getItem('user')!)?._id;
  isMenuOpen = signal(false);
  isEditing = signal(false);
  editBody = new FormControl('', { nonNullable: true });
  editPrivacy = new FormControl('public', { nonNullable: true });
  editImage: File | null = null;
  showDeleteDialog = false;

  openPost(event: Event): void {
    if (
      event.target instanceof Element &&
      event.target.closest('button, a, input, textarea, select, label, form')
    ) {
      return;
    }

    void this.router.navigate(['/details', this.post()._id]);
  }

  toggleMenu(): void {
    this.isMenuOpen.update(value => !value);
  }

  startEditing(): void {
    this.editBody.setValue(this.post().body ?? '');
    this.editPrivacy.setValue(this.post().privacy ?? 'public');
    this.editImage = null;
    this.isEditing.set(true);
    this.isMenuOpen.set(false);
  }

  cancelEditing(): void {
    this.isEditing.set(false);
    this.editImage = null;
  }

  selectEditImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.editImage = input.files?.[0] ?? null;
  }

  saveChanges(event: SubmitEvent): void {
    event.preventDefault();
    const formData = new FormData();
    formData.append('body', this.editBody.value);
    formData.append('privacy', this.editPrivacy.value);
    if (this.editImage) {
      formData.append('image', this.editImage);
    }

    this.postsService.updatePost(this.post()._id, formData).subscribe({
      next: (res) => {
        if (res.success) {
          this.isEditing.set(false);
          this.postChanged.emit();
        }
      },
      error: (err) => console.error(err),
    });
  }

  deletePost(): void {
    this.showDeleteDialog = false;

    this.postsService.deletePost(this.post()._id).subscribe({
      next: (res) => {
        if (res.success) {
          this.isMenuOpen.set(false);
          this.postChanged.emit();
        }
      },
      error: (err) => console.error(err),
    });
  }



}
