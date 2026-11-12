import { DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Comment } from '../comment-list/comment.interface';
import { CommentsService } from '../comment-list/comments.service';
import { ConfirmDialogComponent } from '../../../../shared/ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-comment-item',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, ConfirmDialogComponent],
  templateUrl: './comment-item.component.html',
  styleUrl: './comment-item.component.css',
})
export class CommentItemComponent {
  private readonly commentsService = inject(CommentsService);

  @Input({ required: true }) comment!: Comment;
  @Output() commentChanged = new EventEmitter<void>();

  userId = JSON.parse(localStorage.getItem('user') ?? 'null')?._id as string | undefined;
  isEditing = false;
  isSaving = false;
  errorMessage = '';
  editContent = new FormControl('', { nonNullable: true });
  editImage: File | null = null;
  editImagePreview: string | null = null;
  showDeleteDialog = false;

  get isOwner(): boolean {
    return this.comment.commentCreator._id === this.userId;
  }

  startEditing(): void {
    this.editContent.setValue(this.comment.content ?? '');
    this.editImage = null;
    this.editImagePreview = null;
    this.errorMessage = '';
    this.isEditing = true;
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.editImage = null;
    this.editImagePreview = null;
    this.errorMessage = '';
  }

  selectEditImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.editImage = input.files?.[0] ?? null;
    this.editImagePreview = null;

    if (this.editImage) {
      const reader = new FileReader();
      reader.onload = () => this.editImagePreview = reader.result as string;
      reader.readAsDataURL(this.editImage);
    }
  }

  clearEditImage(): void {
    this.editImage = null;
    this.editImagePreview = null;
  }

  saveEdit(event: SubmitEvent): void {
    event.preventDefault();
    const content = this.editContent.value.trim();
    if ((!content && !this.editImage) || this.isSaving) {
      this.errorMessage = 'Add comment text or choose an image.';
      return;
    }

    const formData = new FormData();
    if (content) {
      formData.append('content', content);
    }
    if (this.editImage) {
      formData.append('image', this.editImage);
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.commentsService.updateComment(this.comment.post, this.comment._id, formData).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res.success) {
          this.isEditing = false;
          this.commentChanged.emit();
        } else {
          this.errorMessage = res.message ?? 'Could not update comment.';
        }
      },
      error: () => {
        this.isSaving = false;
      },
    });
  }

  deleteComment(): void {
    this.showDeleteDialog = false;
    this.commentsService.deleteComment(this.comment.post, this.comment._id).subscribe({
      next: (res) => {
        if (res.success) {
          this.commentChanged.emit();
        } else {
          this.errorMessage = res.message ?? 'Could not delete comment.';
        }
      },
      error: () => {},
    });
  }
}
