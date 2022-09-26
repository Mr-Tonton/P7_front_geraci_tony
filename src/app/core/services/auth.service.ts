import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuth$ = new BehaviorSubject<boolean>(false);
  private authToken = '';
  private userId = '';
  currentUserInfo?:User;
  private authUrl:string = `${environment.backendServer}/api/auth`;
  

  constructor(private http: HttpClient,
              private router: Router) {}

  createUser(email: string, password: string, name: string):Observable<Object> {
    return this.http.post<{ message: string }>(`${this.authUrl}/signup`, {email: email, password: password, name: name});
  }

  getToken():string {
    return this.authToken;
  }

  getUserId():string {
    return this.userId;
  }

  loginUser(email: string, password: string):Observable<Object> {
    return this.http.post<{ userId: string, token: string }>(`${this.authUrl}/login`, {email: email, password: password}).pipe(
      tap(({ userId, token }) => {
        this.userId = userId;
        this.authToken = token;
        this.isAuth$.next(true);
        this.getCurrentUserInfo(userId).subscribe(user => this.currentUserInfo = user);
      })
    );
  }

  logout():void {
    this.authToken = '';
    this.userId = '';
    this.isAuth$.next(false);
    this.router.navigate(['/login']);
  }

  getCurrentUserInfo(id: string): Observable<User> {
    return this.http.get<User>(`${this.authUrl}/${id}`);
};
}
