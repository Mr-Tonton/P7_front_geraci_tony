import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { tap, catchError, EMPTY } from 'rxjs';
import { AuthUser } from 'src/app/core/interfaces/auth-user.interface';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initEmptyForm();
  }

  initEmptyForm() {
    this.loginForm = this.fb.group({
      email: [
        null,
        [
          Validators.required,
          Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/),
        ],
      ],
      password: [null, Validators.required],
    });
  }

  onLogin() {
    const userEntries: AuthUser = this.loginForm.value;
    this.authService
      .loginUser(userEntries)
      .pipe(
        catchError((error) => {
          if (error.error.error !== undefined) {
            this.notificationService.openSnackBar(
              `${error.error.error}`,
              'Fermer',
              'error-snackbar'
            );
          } else if (error.status === 0) {
            this.notificationService.openSnackBar(
              'Un problème est rencontré avec le serveur, essayez ultérieurement',
              'Fermer',
              'error-snackbar'
            );
          }
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.notificationService.openSnackBar(
          'Identifiants valides, bienvenue sur Groupomania !',
          'Fermer',
          'success-snackbar',
          5000
        );
        this.router.navigate(['/feed']);
      });
  }
}
