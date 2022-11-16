import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { catchError, EMPTY, switchMap } from 'rxjs';

import { AuthUser } from 'src/app/core/interfaces/auth-user.interface';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signinForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initEmptyForm();
  }

  initEmptyForm(): void {
    this.signinForm = this.fb.group({
      email: [
        null,
        [
          Validators.required,
          Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/),
        ],
      ],
      password: [
        null,
        [
          Validators.required,
          Validators.pattern(/^(?!.* )(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,64}$/),
        ],
      ],
      name: [
        null,
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9àâéèëêïîôùüç' -]{1,30}$/),
        ],
      ],
    });
  }

  onSignup(): void {
    const userEntries: AuthUser = this.signinForm.value;
    this.authService
      .createUser(userEntries)
      .pipe(
        switchMap(() => this.authService.loginUser(userEntries)),
        catchError((error) => {
          if (error.status === 0) {
            this.notificationService.openSnackBar(
              'Un problème est rencontré avec le serveur, essayez ultérieurement',
              'Fermer',
              'error-snackbar'
            );
          } else {
            this.notificationService.openSnackBar(
              'Email déjà utilisé',
              'Fermer',
              'error-snackbar'
            );
          }
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.notificationService.openSnackBar(
          'Bienvenue sur Groupomania !',
          'Fermer',
          'success-snackbar',
          5000
        );
        this.router.navigate(['/feed']);
      });
  }
}
