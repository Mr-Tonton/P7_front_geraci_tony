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
  postCollectionLength!: number;
  noMorePosts: boolean = false;
  skip: number = 0;
  showPreview: boolean = false;
  validPost: boolean = false;
  onLoading: boolean = true;
  currentUserInfo: User | undefined;
  postForm!: FormGroup;
  fewPosts: Post[] = [];
  file: File | undefined;
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
    this.postService
      .getPosts(this.skip, environment.limit)
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
        let posts = res.posts;
        this.skip += environment.limit;
        for (let post of posts) {
          this.fewPosts.push(post);
        }
        this.onLoading = false;
        this.postCollectionLength = res.postCollectionLength;
        if (this.postCollectionLength === this.fewPosts.length) {
          this.noMorePosts = true;
        }
      });
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
        this.imagePreview = null;
        this.file = undefined;
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

  resetFeed() {
    this.fewPosts = [];
    this.skip = 0;
    this.showPreview = false;
    this.validPost = false;
  }

  deletedPost($event: string) {
    let newArray = this.fewPosts.filter((post) => post._id !== $event);
    this.postCollectionLength--;
    this.skip--;
    this.fewPosts = newArray;
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
