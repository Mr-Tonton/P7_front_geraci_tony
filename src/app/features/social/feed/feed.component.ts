import { Component, HostListener, OnInit } from '@angular/core';

import { AuthService } from 'src/app/core/services/auth.service';
import { PostService } from 'src/app/core/services/post.service';
import { UserService } from 'src/app/core/services/user.service';

import { Post } from 'src/app/core/interfaces/post.interface';
import { User } from 'src/app/core/interfaces/user.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit {
  postForm!: FormGroup;
  showPreview: boolean = false;
  currentUserInfo: User | undefined;
  allPosts: Post[] = [];
  textInput!: string;
  file!: File;
  imagePreview!: string;

  constructor(
    private auth: AuthService,
    private user: UserService,
    private post: PostService,
    private fb: FormBuilder
  ) {
    this.textInput = '';
  }

  ngOnInit(): void {
    this.user
      .getCurrentUserInfo(this.auth.getUserId())
      .subscribe((user) => (this.currentUserInfo = user));
    this.getPosts();
    this.initEmptyForm();
    this.auth.verifyLoggedIn();
  }

  private getPosts(): void {
    this.post.getPosts().subscribe((response: Post[]) => {
      this.allPosts = response;
      console.log(this.allPosts);
    });
  }

  private initEmptyForm() {
    this.postForm = this.fb.group({
      postContent: [null, Validators.required],
      image: [null],
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
    this.textInput = '';
    this.imagePreview = '';
  }

  onFileAdded(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.file = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
