import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { User } from 'src/app/core/interfaces/user.interface';
import { AuthService } from 'src/app/core/services/auth.service';
import { PostService } from 'src/app/core/services/post.service';
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
  acceptDeleteAccount = false;
  validDeleteAccount = false;
  file!: File;
  imagePreview: string | null = null;

  constructor(
    private auth: AuthService,
    private user: UserService,
    private fb: FormBuilder,
    private router: Router,
    private post: PostService
  ) {}

  ngOnInit(): void {
    this.user
      .getUserInfo(this.auth.getUserId())
      .subscribe((user) => (this.currentUserInfo = user));
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
    this.user
      .updateName(this.currentUserInfo?.userId, nameEntry)
      .pipe(
        tap((res) => {
          this.currentUserInfo!.name = res;
          this.changingName = false;
        })
      )
      .subscribe();
    this.nameForm.reset();
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
    this.inputImage.nativeElement.value = '';
    this.imagePreview = null;
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
      this.deleteAccount = false;
      this.acceptDeleteAccount = true;
      this.post.deleteAllUserPost(this.currentUserInfo?.userId).subscribe();
      setTimeout(() => {
        this.router.navigate(['/login']);
        this.acceptDeleteAccount = false;
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
