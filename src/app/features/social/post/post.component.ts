import { Component, Input, OnInit } from '@angular/core';
import { Post } from 'src/app/core/interfaces/post.interface';
import { User } from 'src/app/core/interfaces/user.interface';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  postUser!: User;
  @Input() post!: Post;
  showComments: boolean = false;
  constructor(private user: UserService) {}

  ngOnInit(): void {
    this.getUserInfo();
  }

  openComments() {
    this.showComments = true;
  }

  closeComments() {
    this.showComments = false;
  }

  getUserInfo() {
    return this.user.getUserInfo(this.post.userId).subscribe((res) => {
      this.postUser = res;
    });
  }
}
