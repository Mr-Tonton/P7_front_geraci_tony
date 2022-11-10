import { Component, HostListener, OnInit } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';

import { Post } from 'src/app/core/interfaces/post.interface';
import { User } from 'src/app/core/interfaces/user.interface';
import { environment } from 'src/environments/environment';

import { NotificationService } from 'src/app/core/services/notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { PostService } from 'src/app/core/services/post.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit {
  postUpdate!: Post | undefined;
  postCollectionLength!: number;
  noMorePosts: boolean = false;
  skip: number = 0;
  showPreview: boolean = false;
  validPost: boolean = false;
  onLoading: boolean = true;
  currentUserInfo: User | undefined;
  fewPosts: Post[] = [];
  imagePreview: string | null = null;

  constructor(
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
    this.getPosts();
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

  openPreview() {
    this.showPreview = true;
  }

  closePreview() {
    this.showPreview = false;
    this.imagePreview = null;
    this.postUpdate = undefined;
  }

  resetFeed() {
    this.fewPosts = [];
    this.skip = 0;
    this.updatePost;
    this.showPreview = false;
    this.validPost = false;
  }

  deletedPost($event: string) {
    let newArray = this.fewPosts.filter((post) => post._id !== $event);
    this.postCollectionLength--;
    this.skip--;
    this.fewPosts = newArray;
  }

  updatePost($event: Post) {
    this.postUpdate = $event;
    this.showPreview = true;
  }

  postedPost() {
    this.noMorePosts = false;
    this.showPreview = false;
    this.resetFeed();
    this.getPosts();
  }

  updatedPost() {
    this.postUpdate = undefined;
    this.noMorePosts = false;
    this.showPreview = false;
    this.resetFeed();
    this.getPosts();
  }
}
