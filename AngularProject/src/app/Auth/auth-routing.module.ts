import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";

const routes: Routes = [
  {
    path:'login', //Localhost:4200/edit/login
    component: LoginComponent
  },
  {
    path:'signup', //Localhost:4200/edit/signup
    component: SignupComponent
  }
]

@NgModule({
  imports:[
    RouterModule.forChild(routes)
  ],
  exports:[
    RouterModule
  ]
})

export class AuthRoutingModule{

}
