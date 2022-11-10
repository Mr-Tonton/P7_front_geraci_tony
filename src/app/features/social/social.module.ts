import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedComponent } from './feed/feed.component';
import { ProfilComponent } from './profil/profil.component';
import { PostComponent } from './post/post.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommentComponent } from './comment/comment.component';
import { PostFormComponent } from './post-form/post-form.component';

@NgModule({
  declarations: [
    FeedComponent,
    ProfilComponent,
    PostComponent,
    CommentComponent,
    PostFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
})
export class SocialModule {}
