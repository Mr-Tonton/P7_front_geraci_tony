import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Comment } from '../interfaces/comment.interface';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private url: string = `${environment.backendServer}/api/posts`;

  constructor(private http: HttpClient) {}
  getComments(postId: string, skip: number, limit: number) {
    return this.http.get<any>(
      `${this.url}/${postId}/comments/${skip}/${limit}`
    );
  }
  createComment(postId: string, comment: Comment) {
    const formData = new FormData();
    formData.append('comment', JSON.stringify(comment));
    return this.http.post<{ message: string }>(
      `${this.url}/${postId}/comments`,
      formData
    );
  }

  deleteComment(postId: string, commentId: string) {
    return this.http.delete(`${this.url}/${postId}/comments/${commentId}`);
  }
}
