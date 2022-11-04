import { Component, Input, OnInit } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { Post } from 'src/app/core/interfaces/post.interface';
import { User } from 'src/app/core/interfaces/user.interface';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { PostService } from 'src/app/core/services/post.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  postUser!: User;
  @Input() post!: Post;

  showComments = false;
  showChoice = false;
  deletePost = false;
  currentUserId!: string | null;
  currentUserTypeAccount!: string | null;
  liked = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private postService: PostService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.getUserInfo();
    this.getCurrentUserInfo();
  }

  openCloseComments() {
    this.showComments
      ? (this.showComments = false)
      : (this.showComments = true);
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
        location.reload();
      });
  }

  onUpdatePost() {}

  onLike() {
    this.postService.likePost(this.post._id, !this.liked).subscribe(() => {
      this.liked = !this.liked;
      location.reload();
    });
  }
}
