import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './core/components/page-not-found/page-not-found.component';
import { AuthGuard } from './core/guards/auth.guard';
import { FeedComponent } from './features/social/feed/feed.component';
import { ProfileComponent } from './features/social/profile/profile.component';
import { LoginComponent } from './features/user/login/login.component';
import { SignupComponent } from './features/user/signup/signup.component';

const routes: Routes = [
  { path: '', redirectTo: 'feed', pathMatch: 'full' },
  { path: 'feed', canActivate: [AuthGuard], component: FeedComponent },
  { path: 'profil', canActivate: [AuthGuard], component: ProfileComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
