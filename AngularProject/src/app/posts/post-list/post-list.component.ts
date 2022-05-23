import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostServiceService } from '../post-service.service';
import { Subscription } from 'rxjs';
import { Post } from './post.model';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/Auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = []
  private postsSub: Subscription;
  public isLoading = false;
  public totalPosts = 0;
  public postsPerPage =  2;
  public currentPage = 1;
  public pageSizeOptions = [1, 2, 3, 5, 10];
  public userId: string;
  public userIsAuthenticated = false;
  private authStatusSubs: Subscription;

  constructor(public postsService: PostServiceService, private authService: AuthService) {
  }

  onDelete(postId: string){
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService.getPostUpdateListener().subscribe(
      (postData: {posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      }
    );
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSubs = this.authService.getAuthStatusListener().subscribe(isAuthentiaced => {
      this.userIsAuthenticated = isAuthentiaced;
      this.userId = this.authService.getUserId();
    });

  }

  ngOnDestroy(): void {
      this.postsSub.unsubscribe();
      this.authStatusSubs.unsubscribe();
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

}
