import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommentService } from 'src/app/core/services/comment.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UserService } from 'src/app/core/services/user.service';
import { Comment } from '../../../core/interfaces/comment.interface';
import { User } from '../../../core/interfaces/user.interface';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {
  @Input() comment!: Comment;
  @Output() commentDeleted: EventEmitter<string> = new EventEmitter<string>();
  commentUserInfo!: User;
  commentUserId!: string;
  currentUserTypeAccount!: string | null;
  currentUserId!: string | null;
  deleteComment: boolean = false;

  constructor(
    private userService: UserService,
    private commentService: CommentService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getCurrentUserInfo();
    this.getCommentUserInfo();
  }

  getCurrentUserInfo() {
    this.currentUserId = this.authService.getUserId();
    this.userService.getUserInfo(this.currentUserId).subscribe((res) => {
      this.currentUserTypeAccount = res.accountType;
    });
  }

  getCommentUserInfo() {
    this.commentUserId = this.comment.userId;
    this.userService.getUserInfo(this.commentUserId).subscribe((res) => {
      this.commentUserInfo = res;
    });
  }

  openDeleteComment() {
    this.deleteComment = true;
  }
  stopDeleteComment() {
    this.deleteComment = false;
  }

  onDeleteComment() {
    this.commentService
      .deleteComment(this.comment.postId, this.comment._id)
      .pipe(
        catchError((error) => {
          error.status === 401
            ? this.notificationService.openSnackBar(
                `${error.error.error}`,
                'Fermer',
                'error-snackbar'
              )
            : this.notificationService.openSnackBar(
                'Veuillez essayer ultérieurement',
                'Fermer',
                'error-snackbar'
              );
          return EMPTY;
        })
      )
      .subscribe((res) => {
        this.notificationService.openSnackBar(
          'Commentaire supprimé avec succès !',
          'Fermer',
          'success-snackbar'
        );
        this.commentDeleted.emit(this.comment._id);
      });
  }
}
