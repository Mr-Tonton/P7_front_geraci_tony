import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedComponent } from './feed/feed.component';
import { ProfilComponent } from './profil/profil.component';



@NgModule({
  declarations: [
    FeedComponent,
    ProfilComponent,
  ],
  imports: [
    CommonModule,
  ],
})
export class SocialModule { }
