import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { tap, catchError, EMPTY, VirtualTimeScheduler } from "rxjs"
import { AuthUser } from 'src/app/core/interfaces/auth-user';


@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  errorMsg!: string;
  validMsg!: string;
  loginForm!: FormGroup;

  constructor(
    private auth: AuthService, 
    private router:Router, 
    private fb:FormBuilder) { }

  ngOnInit():void {
    this.loginForm = this.fb.group({
        email: [null, [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/)]],
        password: [null, Validators.required],
      });
  }

  onLogin() {
    const userEntries: AuthUser = this.loginForm.value;
    this.auth.loginUser(userEntries).pipe(
      tap(() => {
        this.validMsg = "Identifiants valides, connexion...";
        setTimeout(() => {
          this.router.navigate(['/feed']);
        }, 1500);
      }),
      catchError(error => {
        if(error.error.error !== undefined) {
          this.errorMsg = error.error.error;
        } else if(error.status === 0) {
          this.errorMsg = "Un problème est rencontré avec le serveur, essayez ultérieurement";
        }
        return EMPTY;
      })
    ).subscribe();
  };
}
