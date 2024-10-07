import { Component, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import User from '../../types/user';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Address from '../../types/address';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, ReactiveFormsModule, CommonModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {
  formBuilder = inject(FormBuilder);
  userForm: FormGroup = this.formBuilder.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('^[0-9]+$')]],
    address: ['', [Validators.required]],
    city: ['', [Validators.required]],
    state: ['', [Validators.required]],
    pincode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern('^[0-9]+$')]],
  });

  userService = inject(UserService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  editUserId!: string;
  isSignup = false;
  isAdd = false;
  address: Address | null=null;
  editAddressId!: string;

  url = this.router.url;
  ngOnInit() {
    
    if (this.url === '/users/signup') {
      this.isSignup = true;
    } else if (this.url === '/users/add') {
      this.isAdd = true;
    } else {
      this.editUserId = this.route.snapshot.params['id'];
      if (this.editUserId) {
        this.userService.getUser(this.editUserId).subscribe((result) => {
          this.userForm.patchValue(result);
        });
        this.userService.getAddress(this.editUserId).subscribe((result: Address) => {
          this.userForm.patchValue(result);
        });    
      }
    }
  }

  signup() {
    if (this.userForm.invalid) {
      this.showInvalid('Provide all fields with valid data');
      return;
    }

    const model: User = this.userForm.value;
    this.userService.addUser(model).subscribe((result) => {
      this.showSuccess('Signup Successful! Redirecting to login page...');
      this.router.navigateByUrl('/');
    },
    (error) => {
      console.error('Login failed', error);
      this.showInvalid("User Email already exists");
    });
  }

  addUser() {
    if (this.userForm.invalid) {
      this.showInvalid('Provide all fields with valid data');
      return;
    }

    const model: User = this.userForm.value;
    model.category='c';
    this.userService.addUser(model).subscribe((result) => {
      this.showSuccess('Customer Added Successfully');
      this.router.navigateByUrl('/users');
    },
    (error) => {
      console.error('Login failed', error);
      this.showInvalid("User Email Already Exists");
    });
  }

  updateUser() {
    if (this.userForm.invalid) {
      this.showInvalid('Provide all fields with valid data');
      return;
    }

    const model: User = this.userForm.value;
    this.userService.updateUser(this.editUserId, model).subscribe((result) => {
      this.showSuccess('Customer Updated Successfully');
      this.router.navigateByUrl('/users');
    });
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
