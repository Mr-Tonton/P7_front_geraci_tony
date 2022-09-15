import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedComponent } from './feed/feed.component';
import { ProfilComponent } from './profil/profil.component';

const SOCIAL_ROUTES: Routes = [
  { path: "feed", component: FeedComponent },
  { path: "profil", component: ProfilComponent }
];

@NgModule({
  imports: [RouterModule.forChild(SOCIAL_ROUTES)],
  exports: [RouterModule]
})
export class TestRoutingModule { }
