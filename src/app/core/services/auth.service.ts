import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthUser } from '../interfaces/auth-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userId: string = "";
  public isAuth$ = new BehaviorSubject<boolean>(false);
  private authUrl:string = `${environment.backendServer}/api/auth`;
  

  constructor(private http: HttpClient,
              private router: Router) {}

  createUser(user: AuthUser):Observable<Object> {
    return this.http.post<{ message: string }>(`${this.authUrl}/signup`, {email: user.email, password: user.password, name: user.name});
  }

  getToken():string | null {
    return localStorage.getItem("token");
  }

  getUserId():string | null {
    return this.userId;
  }

  loginUser(user: AuthUser):Observable<Object> {
    return this.http.post<{ userId: string, token: string }>(`${this.authUrl}/login`, {email: user.email, password: user.password}).pipe(
      tap(({ userId, token }) => {
        localStorage.setItem("token", token);
        this.userId = userId;
        this.isAuth$.next(true);
      })
    );
  }

  verifyLoggedIn() {
    this.http.get(`${this.authUrl}/token/${this.getToken()}`).subscribe(() => {
      this.isAuth$.next(true);
    });
  }

  logout():void {
    localStorage.removeItem("token");
    this.userId = "";
    this.isAuth$.next(false);
    this.router.navigate(['/login']);
  }
}
