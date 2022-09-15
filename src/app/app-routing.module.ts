import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    { path: '', redirectTo: "auth", pathMatch:"full" },
    { 
      path: "",
      loadChildren: () => 
      import("./features/social/social-routing.module").then( m => m.TestRoutingModule)
    },
    { 
      path: "",
      loadChildren: () => 
      import("./features/user/user-routing.module").then( m => m.UserRoutingModule)
    }
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