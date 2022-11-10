import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { Post } from 'src/app/core/interfaces/post.interface';
import { User } from 'src/app/core/interfaces/user.interface';
import { Comment } from 'src/app/core/interfaces/comment.interface';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommentService } from 'src/app/core/services/comment.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { PostService } from 'src/app/core/services/post.service';
import { UserService } from 'src/app/core/services/user.service';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  postUser!: User;
  @Input() post!: Post;
  @Output() postDeleted: EventEmitter<string> = new EventEmitter<string>();
  @Output() postUpdateStarted: EventEmitter<Post> = new EventEmitter<Post>();
  showComments = false;
  showChoice = false;
  deletePost = false;
  currentUserId!: string | null;
  currentUserTypeAccount!: string | null;
  liked = false;
  skip: number = 0;
  fewComments: Comment[] = [];
  commentCollectionLength!: number;
  noMoreComments: boolean = false;
  showCommentsText: string = 'voir commentaires';
  commentForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private postService: PostService,
    private commentService: CommentService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getUserInfo();
    this.getCurrentUserInfo();
    this.getComments();
    this.initEmptyForm();
  }

  initEmptyForm() {
    this.commentForm = this.fb.group({
      commentContent: [null, Validators.required],
      userId: [null],
    });
  }

  getComments(): void {
    this.commentService
      .getComments(this.post._id, this.skip, environment.limit)
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
        let comments = res.comments;
        this.skip += environment.limit;
        for (let comment of comments) {
          this.fewComments.push(comment);
        }
        this.commentCollectionLength = res.commentCollectionLength;
        if (this.commentCollectionLength === this.fewComments.length) {
          this.noMoreComments = true;
        }
      });
  }

  openCloseComments() {
    if (!this.showComments && this.fewComments.length > 0) {
      this.showComments = true;
      this.showCommentsText = 'cacher commentaires';
    } else {
      this.showComments = false;
      this.showCommentsText = 'voir commentaires';
      this.resetComments();
      this.getComments();
    }
  }

  getCurrentUserInfo() {
    this.currentUserId = this.authService.getUserId();
    this.userService.getUserInfo(this.currentUserId).subscribe((res) => {
      this.currentUserTypeAccount = res.accountType;
      if (this.post.usersLiked.find((user) => user === this.currentUserId)) {
        this.liked = true;
      }
    });
  }

  getUserInfo() {
    return this.userService.getUserInfo(this.post.userId).subscribe((res) => {
      this.postUser = res;
    });
  }
  openPostChoice() {
    if (this.showChoice) {
      this.showChoice = false;
    } else {
      this.showChoice = true;
    }
  }

  openDeletePost() {
    this.deletePost = true;
    this.showChoice = false;
  }

  stopDeletePost() {
    this.deletePost = false;
    this.showChoice = false;
  }

  onDeletePost() {
    this.postService
      .deletePost(this.post._id)
      .pipe(
        catchError((error) => {
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.notificationService.openSnackBar(
          'Post supprimé avec succès !',
          'Fermer',
          'success-snackbar'
        );
        this.deletePost = false;
        this.showChoice = false;
        this.postDeleted.emit(this.post._id);
      });
  }

  onUpdatePost() {
    this.postUpdateStarted.emit(this.post);
  }

  resetComments() {
    this.fewComments = [];
    this.skip = 0;
    this.noMoreComments = false;
  }

  onCommentSubmit() {
    this.commentForm.get('userId')?.setValue(this.currentUserId);
    this.commentService
      .createComment(this.post._id, this.commentForm.value)
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
      .subscribe((res) => {
        this.commentForm.reset();
        this.notificationService.openSnackBar(
          `${res.message}`,
          'Fermer',
          'success-snackbar'
        );
        this.resetComments();
        this.getComments();
        this.showComments = true;
        this.showCommentsText = 'cacher commentaire';
      });
  }

  onLike() {
    this.postService.likePost(this.post._id, !this.liked).subscribe(() => {
      this.liked = !this.liked;
      this.post.likes = this.liked ? this.post.likes + 1 : this.post.likes - 1;
    });
  }

  deletedComment($event: string) {
    let newArray = this.fewComments.filter((comment) => comment._id !== $event);
    this.commentCollectionLength--;
    this.skip--;
    this.fewComments = newArray;
  }
}
