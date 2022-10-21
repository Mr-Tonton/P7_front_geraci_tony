import { Component, Input, OnInit } from '@angular/core';
import { Post } from 'src/app/core/interfaces/post.interface';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  constructor() { }
  showComments: boolean = false;
  @Input() post!: Post;

  ngOnInit(): void {
  }

  openComments() {
    this.showComments = true;
  }

  closeComments() {
    this.showComments = false;
  }

}
