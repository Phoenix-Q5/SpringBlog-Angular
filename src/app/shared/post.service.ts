import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PostModel } from './post-model';
import { Observable } from 'rxjs';
import { CreatePostPayload } from '../post/create-post/create-post.payload';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient, private spinner:NgxSpinnerService) { }

  getAllPosts(): Observable<Array<PostModel>> {
    return this.http.get<Array<PostModel>>(`${environment.apiBaseUrl}/posts/`);
  }

  createPost(postPayload: CreatePostPayload): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/posts/`, postPayload);
  }

  getPost(id: number): Observable<PostModel> {
    return this.http.get<PostModel>(`${environment.apiBaseUrl}/posts/` + id);
  }

  getAllPostsByUser(name: string): Observable<PostModel[]> {
    return this.http.get<PostModel[]>(`${environment.apiBaseUrl}/posts/by-user/` + name);
  }
}
