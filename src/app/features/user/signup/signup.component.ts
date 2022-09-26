import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { tap, catchError, EMPTY, switchMap } from "rxjs"

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  errorMsg!: string;
  validMsg!: string;
  signinForm!: FormGroup;

  constructor(
    private auth: AuthService, 
    private router:Router, 
    private fb:FormBuilder) { }

  ngOnInit(): void {
    this.signinForm = this.fb.group({
      email: [null, [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/)]],
      password: [null, [Validators.required, Validators.pattern(/^(?!.* )(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,64}$/)]],
      name: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9àâéèëêïîôùüç' -]{1,30}$/)]],
    });
  }

  onSignup() {
    const email = this.signinForm.get('email')!.value;
    const password = this.signinForm.get('password')!.value;
    const name = this.signinForm.get('name')!.value;
    this.auth.createUser(email, password, name).pipe(
      switchMap(() => this.auth.loginUser(email, password)),
      tap(() => {
        this.validMsg = "Utilisateur créé"
        setTimeout(() => {
          this.router.navigate(['/feed']);
        }, 1500);
      }),
      catchError(error => {
        console.log(error.error.message);
      if(error.status === 0) {
          this.errorMsg = "Un problème est rencontré avec le serveur, essayez ultérieurement";
        } else {
          this.errorMsg = "Email déjà utilisé";
      }
        return EMPTY;
      })
    ).subscribe();
  }
}
