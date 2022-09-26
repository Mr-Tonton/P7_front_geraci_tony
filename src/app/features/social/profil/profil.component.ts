import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/interfaces/user.interface';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})

export class ProfilComponent implements OnInit{
  currentUserInfo: User | undefined = this.auth.currentUserInfo;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }
}
