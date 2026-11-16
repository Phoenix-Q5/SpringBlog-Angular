import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../environments/environment';
import { CommentService } from './comment/comment.service';
import { PostService } from './shared/post.service';
import { VoteService } from './shared/vote.service';
import { VoteType } from './shared/vote-button/vote-type';
import { SubredditService } from './subreddit/subreddit.service';

describe('configured API URLs', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('uses the configured base for posts, comments, categories and votes', () => {
    const posts = TestBed.inject(PostService);
    const comments = TestBed.inject(CommentService);
    const categories = TestBed.inject(SubredditService);
    const votes = TestBed.inject(VoteService);

    posts.getAllPosts().subscribe();
    posts.createPost({ postName: 'post', description: 'description' }).subscribe();
    posts.getPost(1).subscribe();
    posts.getAllPostsByUser('user').subscribe();
    comments.getAllCommentsForPost(1).subscribe();
    comments.postComment({ postId: 1, text: 'comment' }).subscribe();
    comments.getAllCommentsByUser('user').subscribe();
    categories.getAllSubreddits().subscribe();
    categories.createSubreddit({ name: 'category', description: 'description' }).subscribe();
    votes.vote({ postId: 1, voteType: VoteType.UPVOTE }).subscribe();

    const requests: [string, string][] = [
      ['GET', '/posts/'], ['POST', '/posts/'], ['GET', '/posts/1'], ['GET', '/posts/by-user/user'],
      ['GET', '/comments/by-post/1'], ['POST', '/comments/'], ['GET', '/comments/by-user/user'],
      ['GET', '/category'], ['POST', '/category'], ['POST', '/votes/']
    ];
    for (const [method, path] of requests) {
      const request = http.expectOne(req => req.method === method && req.url === `${environment.apiBaseUrl}${path}`);
      expect(request.request.url).toBe(`${environment.apiBaseUrl}${path}`);
      request.flush({});
    }
  });
});
