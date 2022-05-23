import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/Auth/auth.service';
import { Post } from '../post-list/post.model';
import { PostServiceService } from '../post-service.service';
import { mimeType } from './mimi-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {

  constructor(public postsService: PostServiceService, public route: ActivatedRoute, private authService: AuthService) { }

  public enteredContent="";
  public enteredTitle="";
  public imagePreview: string | ArrayBuffer;
  private mode = 'create';
  private postId: string;
  public post: Post;
  public isLoading = false;
  private  authStatusSub: Subscription;
  form: FormGroup;

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
    this.form = new FormGroup({
      title :new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(10)]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) =>{
      if(paramMap.has('postId')){
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
        this.isLoading = false;
        this.post = {
            id : postData.post._id,
            title: postData.post.title,
            content: postData.post.content,
            imagePath: postData.post.imagePath,
            creator: postData.post.creator
          }
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
        });
      }
      else{
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost(){

    if(this.form.invalid){
      return
    }
    this.isLoading = true;
    if(this.mode === 'create'){
      this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    }
    else{
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
    }
    this.form.reset();
  }

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    }
    reader.readAsDataURL(file);
  }

  ngOnDestroy(): void {
      this.authStatusSub.unsubscribe();
  }
}
