import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Post } from '../../core/models/post.interface';
import { PostsService } from '../../core/services/posts.service';
import { CommentListComponent } from '../feed/components/comment-list/comment-list.component';


@Component({
  selector: 'app-details',
  imports: [DatePipe, RouterLink, CommentListComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly postsService = inject(PostsService);

  post: Post  = {} as Post;
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const postId = params.get('id');
      if (!postId) {
        this.isLoading = false;
        this.errorMessage = 'Post could not be found.';
        return;
      }

      this.postsService.getSinglePost(postId).subscribe({
        next: (res) => {
          this.post = res?.data?.post ?? null;
          this.isLoading = false;
          if (!this.post) {
            this.errorMessage = 'Post could not be found.';
          }
        },
        error: (err) => {
          console.error('Failed to load post details:', err);
          this.isLoading = false;
          this.errorMessage = 'Could not load this post. Please try again.';
        },
      });
    });
  }
}
