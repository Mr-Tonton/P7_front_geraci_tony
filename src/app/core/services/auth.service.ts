import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import jwt_decode from 'jwt-decode';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { environment } from 'src/environments/environment';
import { AuthUser } from '../interfaces/auth-user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userId: string = '';
  private isAuth$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private authUrl: string = `${environment.backendServer}/api/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  getUserId(): string | null {
    return this.userId;
  }

  getIsAuth(): BehaviorSubject<boolean> {
    return this.isAuth$;
  }

  getTokenFromLs(): string | null {
    return localStorage.getItem('token');
  }

  createUser(user: AuthUser): Observable<Object> {
    return this.http.post<{ message: string }>(`${this.authUrl}/signup`, {
      email: user.email,
      password: user.password,
      name: user.name,
    });
  }

  loginUser(user: AuthUser): Observable<Object> {
    return this.http
      .post<{ userId: string; token: string }>(`${this.authUrl}/login`, {
        email: user.email,
        password: user.password,
      })
      .pipe(
        tap(({ userId, token }) => {
          localStorage.setItem('token', token);
          this.userId = userId;
          this.isAuth$.next(true);
        })
      );
  }

  tryToReconnect(): void {
    let decodedToken: { exp: number; iat: number; userId: string } = jwt_decode(
      localStorage.getItem('token')!
    );
    let dateNow = +(Date.now() / 1000).toFixed();
    if (decodedToken.exp > dateNow) {
      this.isAuth$.next(true);
      this.userId = decodedToken.userId;
    } else {
      localStorage.removeItem('token');
      this.isAuth$.next(false);
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    this.userId = '';
    this.isAuth$.next(false);
    this.router.navigate(['/login']);
  }
}
