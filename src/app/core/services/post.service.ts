import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Post } from '../interfaces/post.interface';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private postUrl:string = `${environment.backendServer}/api/posts`;

  constructor(private http: HttpClient) { }

  getPosts(): Observable<Post[]> {
     return this.http.get<any>(`${this.postUrl}`);
  }
}
