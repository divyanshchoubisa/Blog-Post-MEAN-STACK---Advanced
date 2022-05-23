import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from './Auth/auth-guard.guard';
import { LoginComponent } from './Auth/login/login.component';
import { SignupComponent } from './Auth/signup/signup.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';

const routes: Routes = [
  {
    path: '',  //HomeRoute
    component: PostListComponent
  },
  {
    path:'create', //Localhost:4200/create
    component: PostCreateComponent,
    canActivate: [AuthGuardGuard]
  },
  {
    path:'edit/:postId', //Localhost:4200/edit/:postId
    component: PostCreateComponent,
    canActivate: [AuthGuardGuard]
  },
  {
    path:'auth',
    loadChildren: () => import('./Auth/auth.module').then(m => m.AuthModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuardGuard]
})
export class AppRoutingModule { }
