import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Post } from '../interfaces/post.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private postUrl: string = `${environment.backendServer}/api/posts`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getPosts(skip: number, limit: number) {
    return this.http.get<any>(`${this.postUrl}/${skip}/${limit}`);
  }

  createPost(post: Post, image?: File | string): Observable<Object> {
    const formData = new FormData();
    formData.append('post', JSON.stringify(post));
    if (image !== undefined) {
      formData.append('image', image);
    }
    return this.http.post<{ message: string }>(`${this.postUrl}`, formData);
  }

  deletePost(post_id: string) {
    return this.http.delete(`${this.postUrl}/${post_id}`);
  }

  likePost(id: string, like: boolean) {
    return this.http.post(`${this.postUrl}/${id}/like`, {
      userId: this.authService.getUserId(),
      like: like ? 1 : 0,
    });
  }
}
