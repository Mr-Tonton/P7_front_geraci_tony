import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./core/guards/auth.guard";
import { FeedComponent } from "./features/social/feed/feed.component";
import { ProfilComponent } from "./features/social/profil/profil.component";
import { LoginComponent } from "./features/user/login/login.component";
import { SignupComponent } from "./features/user/signup/signup.component";

const routes: Routes = [
    { path: '', redirectTo: "feed", pathMatch:"full" },
    { path: "feed", component: FeedComponent, canActivate :[AuthGuard] },
    { path: "profil", component: ProfilComponent, canActivate :[AuthGuard] },
    { path: "signup", component: SignupComponent },
    { path: "login", component: LoginComponent },
  ];
  
  @NgModule({
    imports: [
      RouterModule.forRoot(routes)
    ],
    exports: [
      RouterModule
    ]
  })
  export class AppRoutingModule {}