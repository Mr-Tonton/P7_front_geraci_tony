import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { catchError, EMPTY } from 'rxjs';

import { User } from 'src/app/core/interfaces/user.interface';
import { Post } from 'src/app/core/interfaces/post.interface';
import { AuthService } from 'src/app/core/services/auth.service';
import { PostService } from 'src/app/core/services/post.service';
import { UserService } from 'src/app/core/services/user.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss'],
})
export class PostFormComponent implements OnInit {
  @ViewChild('inputImage', { static: false })
  inputImage!: ElementRef<HTMLInputElement>;
  @ViewChild('inputArea', { static: false })
  inputArea!: ElementRef<HTMLTextAreaElement>;
  @Input() postUpdate!: Post | undefined;
  @Output() postPosted: EventEmitter<any> = new EventEmitter();
  @Output() postUpdated: EventEmitter<any> = new EventEmitter();

  currentUserInfo: User | undefined;
  validPost: boolean = false;
  postForm!: FormGroup;
  updatePostForm!: FormGroup;
  imagePreview: string | undefined = undefined;

  file: File | undefined;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private postService: PostService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.userService
      .getUserInfo(this.authService.getUserId())
      .subscribe((user) => {
        this.currentUserInfo = user;
      });
    this.initEmptyForm();
    if (this.postUpdate) {
      this.initUpdateForm();
      this.imagePreview = this.postUpdate.imageUrl;
    }
  }

  initEmptyForm(): void {
    this.postForm = this.fb.group({
      postContent: [null, Validators.required],
      userId: [null],
    });
  }

  initUpdateForm(): void {
    this.updatePostForm = this.fb.group({
      postContent: [this.postUpdate!.postContent, Validators.required],
      deletedImage: [false],
    });
  }

  onPostSubmit(): void {
    this.postForm.get('userId')?.setValue(this.currentUserInfo?.userId);
    this.postService
      .createPost(this.postForm.value, this.file ?? undefined)
      .pipe(
        catchError((error) => {
          if (error.error.error.name === 'ValidationError') {
            this.notificationService.openSnackBar(
              'Veuillez ajouter du contenu',
              'Fermer',
              'error-snackbar'
            );
          } else {
            this.notificationService.openSnackBar(
              'Veuillez essayer ultérieurement',
              'Fermer',
              'error-snackbar'
            );
          }
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.imagePreview = undefined;
        this.file = undefined;
        this.inputImage.nativeElement.value = '';
        this.postForm.reset();
        this.validPost = true;
        this.notificationService.openSnackBar(
          'Votre post a été créé avec succès !',
          'Fermer',
          'success-snackbar'
        );
        this.postPosted.emit();
      });
  }

  onUpdatePostSubmit(): void {
    if (this.postUpdate?.imageUrl && this.imagePreview === undefined) {
      this.updatePostForm.get('deletedImage')?.setValue(true);
    }
    this.postService
      .updatePost(
        this.postUpdate!._id,
        this.updatePostForm.value,
        this.file ?? undefined
      )
      .pipe(
        catchError((error) => {
          if (error.error.error.name === 'ValidationError') {
            this.notificationService.openSnackBar(
              'Veuillez ajouter du contenu',
              'Fermer',
              'error-snackbar'
            );
          } else {
            this.notificationService.openSnackBar(
              'Veuillez essayer ultérieurement',
              'Fermer',
              'error-snackbar'
            );
          }
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.imagePreview = undefined;
        this.file = undefined;
        this.inputImage.nativeElement.value = '';
        this.updatePostForm.reset();
        this.validPost = true;
        this.notificationService.openSnackBar(
          'Votre post a été modifié avec succès !',
          'Fermer',
          'success-snackbar'
        );
        this.postUpdated.emit();
      });
  }

  autoGrow(e: any): void {
    this.inputArea.nativeElement.style.height = `auto`;
    this.inputArea.nativeElement.style.height = `${e.target.scrollHeight}px`;
  }

  cancelImage(): void {
    this.imagePreview = undefined;
    this.file = undefined;
    this.inputImage.nativeElement.value = '';
  }

  onFileAdded(event: Event): void {
    this.file = (event.target as HTMLInputElement).files![0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    if (this.file !== undefined) {
      reader.readAsDataURL(this.file);
    } else {
      this.cancelImage();
    }
  }
}
