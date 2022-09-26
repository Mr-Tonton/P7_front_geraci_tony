import { Component, HostListener, OnInit } from '@angular/core';
import { Post } from 'src/app/core/interfaces/post.interface';
import { User } from 'src/app/core/interfaces/user.interface';
import { AuthService } from 'src/app/core/services/auth.service';
import { PostService } from 'src/app/core/services/post.service';

@Component({
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

  showPreview: boolean = false;
  showComments: boolean = false;
  currentUserInfo: User | undefined= this.auth.currentUserInfo;
  allPosts: Post[] = [];

  constructor(
    private auth: AuthService,
    private post: PostService
    ) { }

  ngOnInit(): void {
    this.getPosts();
  }
  
  private getPosts():void {
    this.post.getPosts().subscribe(
      (response:Post[]) => {
        this.allPosts = response;
    })
  }




@HostListener("window:keyup", ["$event"])
keyEvent(event: KeyboardEvent) {
  if (event.key === "Escape") {
    this.closePreview();
  }
}

  openPreview() {
    this.showPreview = true;
  }

  closePreview() {
    this.showPreview = false;
  }

  openComments() {
    this.showComments = true;
  }

  closeComments() {
    this.showComments = false;
  }
}
