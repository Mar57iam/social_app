import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommentItemComponent } from '../comment-item/comment-item.component';
import { CommentsService } from './comments.service';
import { Comment } from './comment.interface';
import { CreateCommentComponent } from '../create-comment/create-comment.component';


@Component({
  selector: 'app-comment-list',
  imports: [CommentItemComponent, CreateCommentComponent],
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.css',
})
export class CommentListComponent implements OnInit {

  private readonly commentsService = inject(CommentsService);

  @Input() postId: string = '';
  @Output() commentsChanged = new EventEmitter<void>();
  comments: Comment[] = [];
  showAllComments = false;

  get visibleComments(): Comment[] {
    return this.showAllComments ? this.comments : this.comments.slice(0, 2);
  }

  toggleComments(): void {
    this.showAllComments = !this.showAllComments;
  }

  onCommentCreated(): void {
    this.refreshComments();
  }

  onCommentChanged(): void {
    this.refreshComments();
  }

  private refreshComments(): void {
    this.getAllComments(this.postId);
    this.commentsChanged.emit();
  }

  ngOnInit(): void {
    this.getAllComments(this.postId);
  }
  getAllComments(postId:string):void{
    console.log('Loading comments for post:', postId);
    this.commentsService.getAllComments(postId).subscribe({
      next: (res) => {
        console.log('Get comments response:', res);
        this.comments = res.data.comments ?? [];
        console.log('Comments loaded:', this.comments);
      },
      error: (err) => {
        console.error('Get comments error:', err);
      }
    });
  }
}
