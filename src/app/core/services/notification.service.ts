import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private readonly snackBar: MatSnackBar) {}

  openSnackBar(
    message: string,
    action: string,
    className = '',
    duration = 4000
  ): void {
    this.snackBar.open(message, action, {
      duration: duration,
      panelClass: [className],
    });
  }
}
