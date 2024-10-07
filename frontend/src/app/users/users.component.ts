import { Component, inject } from '@angular/core';
import { UserService } from '../services/user.service';
import User from '../types/user';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    MatButtonModule, 
    RouterLink, 
    CommonModule, 
    MatMenuModule, 
    MatIconModule,
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule,
    FormsModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  formBuilder = inject(FormBuilder);
  searchForm: FormGroup = this.formBuilder.group({
    search: [''],
  });
  users: User[] = [];
  filteredUsers: User[] = [];
  userService = inject(UserService);

  ngOnInit() {
    this.userService.getUsers().subscribe((result) => {
      this.users = result.map(user => ({
        ...user,
      }));
      this.filteredUsers = this.users;
    });
  }

  trackByFn(index: number, item: User): string {
    return item.id!;
  }

  delete(id: string) {
    const ok = confirm("Are you sure you want to delete this customer?");
    if (ok) {
      this.userService.deleteUser(id).subscribe(() => {
        this.showSuccess("Customer deleted successfully");
        this.users = this.users.filter((u) => u.id !== id);
        this.filteredUsers = this.users;
      });
    }
  }

  filterOneAddress() {
    this.filteredUsers = this.users.filter(user => user.addressCount === 1);
  }

  filterMultipleAddresses() {
    this.filteredUsers = this.users.filter(user => user.addressCount > 1);
  }

  showAllUsers() {
    this.filteredUsers = this.users;
  }

  query: string = '';

  search() {
    this.query = this.searchForm.get('search')?.value.toLowerCase();
    this.filteredUsers = this.users.filter(user => 
      user.firstName.toLowerCase().includes(this.query) ||
      user.lastName.toLowerCase().includes(this.query) ||
      user.phoneNumber.includes(this.query) ||
      user.email.toLowerCase().includes(this.query) ||
      user.addresses.some(address => 
        address.address.toLowerCase().includes(this.query) ||
        address.city.toLowerCase().includes(this.query) ||
        address.state.toLowerCase().includes(this.query) ||
        address.pincode.includes(this.query)
      )
    );
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
