import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { PostModel } from '../shared/post-model';
import { PostService } from '../shared/post.service';
import { environment } from '../../environments/environment';

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  posts: Array<PostModel> = [];
  readonly urls = environment.urls;

  constructor(private postService: PostService, private spinner:NgxSpinnerService) {
    this.spinner.show();
    this.postService.getAllPosts().subscribe(post => {
      this.posts = post;
    });
    this.spinner.hide();
  }

  ngOnInit(): void {
  }

}
