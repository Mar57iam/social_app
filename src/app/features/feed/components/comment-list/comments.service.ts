import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private readonly httpClient = inject(HttpClient);

  getAllComments(postId:string):Observable<any>{
    return this.httpClient.get(environment.baseUrl + `/posts/${postId}/comments?page=1&limit=10`  )
  }

  createComment(postId:string, data:FormData):Observable<any>{
    return this.httpClient.post(environment.baseUrl + `/posts/${postId}/comments`,data  )
  }

  updateComment(postId: string, commentId: string, data: FormData): Observable<any> {
    return this.httpClient.put(
      environment.baseUrl + `/posts/${postId}/comments/${commentId}`,
      data,
      
    );
  }

  deleteComment(postId: string, commentId: string): Observable<any> {
    return this.httpClient.delete(
      environment.baseUrl + `/posts/${postId}/comments/${commentId}`,
      
    );
  }

}
