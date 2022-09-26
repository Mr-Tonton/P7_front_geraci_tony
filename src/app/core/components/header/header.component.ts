import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { Observable, shareReplay } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isAuth$!: Observable<boolean>;

  constructor(public router:Router, private auth: AuthService) { }


  ngOnInit(): void {
    this.isAuth$ = this.auth.isAuth$.pipe(
      shareReplay(1)
    );
  }

  public logOut() {
    this.auth.logout();
  }
}
