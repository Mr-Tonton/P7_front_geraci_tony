import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl: string = `${environment.backendServer}`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthService
  ) {}

  getCurrentUserInfo(id: string | null): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/api/auth/${id}`);
  }

  updateName(
    id: string | undefined,
    updatedName: { name: string }
  ): Observable<string> {
    return this.http.put<string>(
      `${this.baseUrl}/api/auth/name/${id}`,
      updatedName
    );
  }

  updateProfileImage(id: string | undefined, image: File | Blob) {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.put<string>(
      `${this.baseUrl}/api/auth/profile_image/${id}`,
      formData
    );
  }

  deleteUser(id: string | undefined) {
    return this.http.delete<string>(`${this.baseUrl}/api/auth/${id}`);
  }
}
