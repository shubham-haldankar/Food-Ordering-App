import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { SignUpComponent } from './sign-up/sign-up.component';

@NgModule({
  declarations: [
    LoginComponent,
    ProfileComponent,
    SignUpComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LoginComponent,
    ProfileComponent,
    SignUpComponent
  ]
})
export class SharedModule { }
