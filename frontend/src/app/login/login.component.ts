import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {MatRadioModule} from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatInputModule,MatButtonModule,ReactiveFormsModule,MatRadioModule,FormsModule,RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  formBuilder=inject(FormBuilder);
  userFor:FormGroup=this.formBuilder.group({
    email:['', [Validators.required, Validators.email]],
    password:['', [Validators.required, Validators.minLength(8)]],
  });
  userService=inject(UserService);
  router=inject(Router);
  route=inject(ActivatedRoute);
  favoriteSeason: string = '1';
  onSubmit() {
    if (this.userFor.invalid) {
      this.showInvalid("Provide all fields with valid data");
      return;
    }
  
    if (this.userFor.valid) {
      const { email, password } = this.userFor.value;
      
      this.userService.loginUser(email, password).subscribe(
        (result) => {
          console.log('result', result);
          if (result.category === "c" && this.favoriteSeason === "1") {
            this.showSuccess('Login successful');
            this.router.navigate(['/dashboard']);  
          } else if (result.category === "a" && this.favoriteSeason === "2") {
            this.showSuccess('Login successful');
            this.router.navigate(['/users']);  
          } else {
            this.showInvalid('There is no such user in this category');
          }
        },
        (error) => {
          console.error('Login failed', error);
          if (error.status === 400 && error.error.message) {
            this.showInvalid(error.error.message); 
          } else if (error.status === 500 && error.error.error) {
            this.showInvalid(error.error.error); 
          } else {
            this.showInvalid('Login Failed'); 
          }
        }
      );      
    }
  }

  constructor(private toastr: ToastrService) {

  } 

  showInvalid(msg: string) {
    this.toastr.error(msg,'Error')
  }

  showSuccess(msg: string) {
    this.toastr.success(msg,'Success')
  }
}
  