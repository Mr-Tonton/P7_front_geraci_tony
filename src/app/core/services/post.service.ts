import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Post } from '../interfaces/post.interface';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private postUrl: string = `${environment.backendServer}/api/posts`;

  constructor(private http: HttpClient) {}

  getPosts(skip: number, limit: number): Observable<Post[]> {
    return this.http.get<any>(`${this.postUrl}/${skip}/${limit}`);
  }

  createPost(post: Post, image?: File) {
    const formData = new FormData();
    formData.append('post', JSON.stringify(post));
    if (image !== undefined) {
      formData.append('image', image);
    }
    return this.http.post<{ message: string }>(`${this.postUrl}`, formData);
  }

  deleteAllUserPost(id: string | undefined) {
    return this.http.delete(`${this.postUrl}/user_posts/${id}`);
  }
}
