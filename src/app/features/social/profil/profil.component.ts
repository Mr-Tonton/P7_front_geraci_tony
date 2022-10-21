import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { User } from 'src/app/core/interfaces/user.interface';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss'],
})
export class ProfilComponent implements OnInit {
  @ViewChild('takeInput', { static: false })
  inputImage!: ElementRef<HTMLInputElement>;
  currentUserInfo: User | undefined;
  nameForm!: FormGroup;
  imageForm!: FormGroup;
  changingName = false;
  deleteAccount = false;
  validDeleteAccount = false;
  file!: File;
  imagePreview: string | null = null;

  constructor(
    private auth: AuthService,
    private user: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
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
    this.user
      .getCurrentUserInfo(this.auth.getUserId())
      .subscribe((user) => (this.currentUserInfo = user));
  }

  startChangingName() {
    !this.changingName
      ? (this.changingName = true)
      : (this.changingName = false);
  }

  onNameSubmit() {
    const nameEntry: { name: string } = this.nameForm.value;
    this.user
      .updateName(this.currentUserInfo?.userId, nameEntry)
      .pipe(
        tap((res) => {
          this.currentUserInfo!.name = res;
          this.changingName = false;
        })
      )
      .subscribe();
  }

  onImageSubmit() {
    this.user
      .updateProfileImage(
        this.currentUserInfo?.userId,
        this.imageForm.get('imageUrl')!.value
      )
      .pipe(
        tap(() => {
          this.imagePreview = null;
        })
      )
      .subscribe((res) => {
        this.currentUserInfo!.imageUrl = res;
      });
  }

  onImageCancel() {
    this.imagePreview = null;
    this.inputImage.nativeElement.value = '';
  }

  startDeleteUser() {
    this.deleteAccount = true;
  }

  stopDeleteUser() {
    this.deleteAccount = false;
  }

  onDeleteCurrentUser() {
    this.user.deleteUser(this.currentUserInfo?.userId).subscribe(() => {
      this.auth.isAuth$.next(false);
      this.validDeleteAccount = true;
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2500);
    });
  }

  onFileAdded(event: Event) {
    this.file = (event.target as HTMLInputElement).files![0];
    this.imageForm.get('imageUrl')!.setValue(this.file);
    this.imageForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(this.file);
  }
}
