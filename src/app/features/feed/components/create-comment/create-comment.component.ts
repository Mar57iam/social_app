import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommentsService } from '../comment-list/comments.service';

@Component({
  selector: 'app-create-comment',
  imports: [ReactiveFormsModule],
  templateUrl: './create-comment.component.html',
  styleUrl: './create-comment.component.css',
})
export class CreateCommentComponent {
  private readonly commentsService = inject(CommentsService);

  @Input() postId = '';
  @Output() commentCreated = new EventEmitter<void>();

  content = new FormControl('', { nonNullable: true });
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  isSubmitting = false;
  errorMessage = '';

  selectImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedImage = input.files?.[0] ?? null;
    this.imagePreview = null;

    if (this.selectedImage) {
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result as string;
      reader.readAsDataURL(this.selectedImage);
    }
  }

  removeImage(): void {
    this.selectedImage = null;
    this.imagePreview = null;
  }

  submitComment(event: SubmitEvent): void {
    event.preventDefault();

    const content = this.content.value.trim();
    if ((!content && !this.selectedImage) || this.isSubmitting) {
      return;
    }

    const formData = new FormData();
    if (content) {
      formData.append('content', content);
    }
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    console.log('Submitting comment:', {
      postId: this.postId,
      content,
      imageName: this.selectedImage?.name ?? null,
    });

    this.isSubmitting = true;
    this.errorMessage = '';
    this.commentsService.createComment(this.postId, formData).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        console.log('Create comment response:', res);
        if (res.success) {
          this.content.reset();
          this.removeImage();
          this.commentCreated.emit();
        } else {
          this.errorMessage = res.message ?? 'The comment was not created.';
        }
      },
      error: () => {
        this.isSubmitting = false;
      },
    });
  }
}
