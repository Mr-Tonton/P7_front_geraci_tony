import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import jwt_decode from 'jwt-decode';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.tryToReconnect();
  }

  tryToReconnect() {
    let decodedToken: { exp: number; iat: number; userId: string } = jwt_decode(
      this.auth.getToken()!
    );
    let dateNow = +(Date.now() / 1000).toFixed();
    if (decodedToken.exp > dateNow) {
      this.auth.isAuth$.next(true);
      this.auth.userId = decodedToken.userId;
    } else {
      localStorage.removeItem('token');
      this.auth.isAuth$.next(false);
    }
  }
}
