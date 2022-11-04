import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, EMPTY, tap } from 'rxjs';

import { AuthService } from 'src/app/core/services/auth.service';
import { PostService } from 'src/app/core/services/post.service';
import { UserService } from 'src/app/core/services/user.service';
import { environment } from 'src/environments/environment';

import { Post } from 'src/app/core/interfaces/post.interface';
import { User } from 'src/app/core/interfaces/user.interface';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit {
  @ViewChild('inputImage', { static: false })
  inputImage!: ElementRef<HTMLInputElement>;
  @ViewChild('inputArea', { static: false })
  inputArea!: ElementRef<HTMLTextAreaElement>;
  collectionLength!: number;
  noMorePosts = false;
  showPreview = false;
  validPost = false;
  onLoading = true;
  currentUserInfo: User | undefined;
  postForm!: FormGroup;
  fewPosts: Post[] = [];
  file!: File;
  imagePreview: string | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private postService: PostService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userService
      .getUserInfo(this.authService.getUserId())
      .subscribe((user) => {
        this.currentUserInfo = user;
      });
    this.getPosts();
    this.initEmptyForm();
  }

  initEmptyForm() {
    this.postForm = this.fb.group({
      postContent: [null, Validators.required],
      userId: [null],
    });
  }

  getPosts(): void {
    this.onLoading = true;
    if (this.fewPosts.length === 0) {
      this.postService
        .getPosts(environment.skip, environment.limit)
        .pipe(
          catchError((error) => {
            this.notificationService.openSnackBar(
              'Un problème est rencontré avec le serveur, essayez ultérieurement',
              'Fermer',
              'error-snackbar'
            );
            console.log(error);
            this.onLoading = false;
            return EMPTY;
          })
        )
        .subscribe((res) => {
          console.log(res);
          this.collectionLength = res.collectionLength;
          this.fewPosts = res.posts;
          if (this.collectionLength === this.fewPosts.length) {
            this.noMorePosts = true;
          }
          this.onLoading = false;
        });
    } else {
      environment.skip += environment.limit;
      this.postService
        .getPosts(environment.skip, environment.limit)
        .subscribe((res) => {
          this.collectionLength = res.collectionLength;
          let posts = res.posts;
          for (let post of posts) {
            this.fewPosts.push(post);
          }
          if (this.collectionLength === this.fewPosts.length) {
            this.noMorePosts = true;
          }
          this.onLoading = false;
        });
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.closePreview();
    }
  }

  autoGrow(e: any) {
    this.inputArea.nativeElement.style.height = `auto`;
    this.inputArea.nativeElement.style.height = `${e.target.scrollHeight}px`;
  }

  openPreview() {
    this.showPreview = true;
  }

  closePreview() {
    this.showPreview = false;
    this.imagePreview = null;
  }

  cancelImage() {
    this.imagePreview = null;
    this.inputImage.nativeElement.value = '';
  }

  onPostSubmit() {
    this.noMorePosts = false;
    this.postForm.get('userId')?.setValue(this.currentUserInfo?.userId);
    if (this.imagePreview) {
      this.postService
        .createPost(this.postForm.value, this.file)
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
          this.imagePreview = null;
          this.postForm.reset();
          this.validPost = true;
          this.notificationService.openSnackBar(
            'Votre post a été créé avec succès !',
            'Fermer',
            'success-snackbar'
          );
          this.resetFeed();
          this.getPosts();
        });
    } else {
      this.postService
        .createPost(this.postForm.value)
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
          this.postForm.reset();
          this.validPost = true;
          this.notificationService.openSnackBar(
            'Votre post a été créé avec succès !',
            'Fermer',
            'success-snackbar'
          );
          this.resetFeed();
          this.getPosts();
        });
    }
  }

  resetFeed() {
    this.fewPosts = [];
    environment.skip = 0;
    this.showPreview = false;
    this.validPost = false;
  }

  onFileAdded(event: Event) {
    this.file = (event.target as HTMLInputElement).files![0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(this.file);
  }
}
