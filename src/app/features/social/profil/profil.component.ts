import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, EMPTY, tap } from 'rxjs';
import { User } from 'src/app/core/interfaces/user.interface';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss'],
})
export class ProfilComponent implements OnInit {
  @ViewChild('inputImage', { static: false })
  inputImage!: ElementRef<HTMLInputElement>;
  currentUserInfo: User | undefined;
  nameForm!: FormGroup;
  imageForm!: FormGroup;
  changingName = false;
  deleteAccount = false;
  acceptDeleteAccount = false;
  file!: File | undefined;
  imagePreview: boolean = false;
  imageContainer: string | undefined = undefined;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService
      .getUserInfo(this.authService.getUserId())
      .subscribe((user) => {
        this.currentUserInfo = user;
        this.imageContainer = this.currentUserInfo.imageUrl;
      });
    this.initEmptyForm();
  }

  initEmptyForm() {
    this.nameForm = this.fb.group({
      name: [
        this.currentUserInfo?.name,
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9àâéèëêïîôùüç' -]{1,30}$/),
        ],
      ],
    });
    this.imageForm = this.fb.group({
      imageUrl: [''],
    });
  }

  startChangingName() {
    !this.changingName
      ? (this.changingName = true)
      : (this.changingName = false);
  }

  onNameSubmit() {
    const nameEntry: { name: string } = this.nameForm.value;
    this.userService
      .updateName(this.currentUserInfo?.userId, nameEntry)
      .subscribe((res) => {
        this.notificationService.openSnackBar(
          "Nom d'utilisateur modifié avec succès !",
          'Fermer',
          'success-snackbar'
        );
        this.currentUserInfo!.name = res;
        this.changingName = false;
      });
    this.nameForm.reset();
  }

  onImageSubmit() {
    this.userService
      .updateProfileImage(
        this.currentUserInfo?.userId,
        this.imageForm.get('imageUrl')!.value
      )
      .pipe(
        catchError((error) => {
          this.notificationService.openSnackBar(
            'Un problème est rencontré avec le serveur, essayez ultérieurement',
            'Fermer',
            'error-snackbar'
          );
          console.log(error);
          return EMPTY;
        })
      )
      .subscribe((res) => {
        this.imagePreview = false;
        this.currentUserInfo!.imageUrl = res;
        this.file = undefined;
        this.inputImage.nativeElement.value = '';
        this.imageContainer = this.currentUserInfo?.imageUrl;
        this.notificationService.openSnackBar(
          'Photo de profil modifiée avec succès !',
          'Fermer',
          'success-snackbar'
        );
      });
  }

  onImageCancel() {
    this.inputImage.nativeElement.value = '';
    this.imagePreview = false;
    this.imageContainer = this.currentUserInfo?.imageUrl;
    this.file = undefined;
  }

  startDeleteUser() {
    this.deleteAccount = true;
  }

  stopDeleteUser() {
    this.deleteAccount = false;
  }

  onDeleteCurrentUser() {
    this.userService.deleteUser(this.currentUserInfo?.userId).subscribe(() => {
      this.authService.getIsAuth().next(false);
      this.notificationService.openSnackBar(
        `Compte utilisateur : ${this.currentUserInfo?.name} supprimé`,
        'Fermer',
        'success-snackbar'
      );
      this.deleteAccount = false;
      this.router.navigate(['/login']);
      localStorage.removeItem('token');
    });
  }

  onFileAdded(event: Event) {
    this.file = (event.target as HTMLInputElement).files![0];
    this.imageForm.get('imageUrl')!.setValue(this.file);
    this.imageForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imageContainer = reader.result as string;
      this.imagePreview = true;
    };
    reader.readAsDataURL(this.file);
  }
}
