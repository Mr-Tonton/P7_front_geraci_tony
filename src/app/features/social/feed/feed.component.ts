import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';

import { AuthService } from 'src/app/core/services/auth.service';
import { PostService } from 'src/app/core/services/post.service';
import { UserService } from 'src/app/core/services/user.service';

import { Post } from 'src/app/core/interfaces/post.interface';
import { User } from 'src/app/core/interfaces/user.interface';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { tap } from 'rxjs';

@Component({
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit {
  @ViewChild('inputImage', { static: false })
  inputImage!: ElementRef<HTMLInputElement>;
  skip = 0;
  limit = 2;
  noMorePosts = false;
  currentUserInfo: User | undefined;
  postForm!: FormGroup;
  showPreview: boolean = false;
  fewPosts: Post[] = [];
  file!: File;
  imagePreview: string | null = null;
  validPost = false;
  validMsg?: string;
  errorMsg?: string;

  constructor(
    private auth: AuthService,
    private user: UserService,
    private post: PostService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.user.getUserInfo(this.auth.getUserId()).subscribe((user) => {
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
    this.post.getPosts(this.skip, this.limit).subscribe((posts: Post[]) => {
      this.fewPosts = posts;
    });
  }

  getMorePosts(): void {
    this.skip += this.limit;
    this.post.getPosts(this.skip, this.limit).subscribe((posts: Post[]) => {
      for (let post of posts) {
        this.fewPosts.push(post);
      }
      if (posts.length < 2) {
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
    let inputArea = document.getElementById('inputArea');
    inputArea!.style.height = `auto`;
    let scHeight = e.target.scrollHeight;
    inputArea!.style.height = `${scHeight}px`;
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
    this.postForm.get('userId')?.setValue(this.currentUserInfo?.userId);
    if (this.imagePreview) {
      this.postForm.addControl('imageUrl', new FormControl(this.file));
      this.post
        .createPost(this.postForm.value, this.file)
        .pipe(
          tap(() => {
            this.imagePreview = null;
          })
        )
        .subscribe();
    } else {
      this.post.createPost(this.postForm.value).subscribe();
    }
    this.postForm.reset();
    this.validPost = true;
    this.validMsg = 'Votre post a été crée avec succès !';

    setTimeout(() => {
      this.skip = 0;
      this.getPosts();
      this.showPreview = false;
      this.validMsg = undefined;
      this.validPost = false;
    }, 2500);
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
