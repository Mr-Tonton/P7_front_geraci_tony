  import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilComponent } from '../social/profil/profil.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';



@NgModule({
  declarations: [
    ProfilComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    CommonModule
  ]
})
export class UserModule { }
