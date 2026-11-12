import { Component, inject, OnInit } from '@angular/core';
import { LeftSidebarComponent } from './components/left-sidebar/left-sidebar.component';
import { RightSidebarComponent } from './components/right-sidebar/right-sidebar.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { PostCardComponent } from './components/post-card/post-card.component';
import { Post } from '../../core/models/post.interface';
import { PostsService } from '../../core/services/posts.service';

@Component({
  selector: 'app-feed',
  imports: [LeftSidebarComponent, RightSidebarComponent, CreatePostComponent, PostCardComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})
export class FeedComponent implements OnInit {

  private readonly postsService = inject(PostsService)
  postList: Post[] = []
 

  ngOnInit(): void {
    this.getAllPostsData()


  }

  getAllPostsData(){
    this.postsService.getAllPosts().subscribe({
      next:(res)=>{
        console.log(res.data.posts)
        this.postList = res.data.posts
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }


}
