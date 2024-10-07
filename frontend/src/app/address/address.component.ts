import { Component, ViewChild, TemplateRef, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../services/user.service';
import User from '../types/user';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Address from '../types/address';
import { MatCardModule } from '@angular/material/card';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [CommonModule, MatMenuModule, FormsModule, MatIconModule, RouterLink, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatCardModule],
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent {
  formBuilder = inject(FormBuilder);
  addressForm: FormGroup = this.formBuilder.group({
    address: ['', [Validators.required]],
    city: ['', [Validators.required]],
    state: ['', [Validators.required]],
    pincode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern('^[0-9]+$')]],
  });

  router = inject(Router);
  editAddressId!: string;
  user: User | null = null;
  addresses: Address[] = [];
  userService = inject(UserService);
  route = inject(ActivatedRoute);
  dialog = inject(MatDialog);
  userId!: string;
  newAddress: any = {}; 

  @ViewChild('addAddressDialog') addAddressDialog!: TemplateRef<any>;

  ngOnInit() {
    this.userId = this.route.snapshot.params['id'];
    this.userService.getUserAddresses(this.userId).subscribe((result) => {
      this.addresses = result;
      console.log(this.addresses);
    }, (error) => {
      console.error('Error fetching address details:', error);
    });
  }

  
  openAddAddressDialog(address?: Address) {
    this.addressForm.reset(); 

    if (address) {
      this.editAddressId = address.id.toString();
      this.addressForm.patchValue(address); 
    } else {
      this.editAddressId = ''; 
    }

    const dialogRef = this.dialog.open(this.addAddressDialog, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveAddress(); 
      }
    });
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  saveAddress() {
    if (this.addressForm.invalid) {
      this.showInvalid('Please fill all fields with valid data.');
      return;
    }

    this.newAddress = this.addressForm.value; 

    if (this.editAddressId) {
      this.userService.updateAddress(this.editAddressId, this.newAddress).subscribe(() => {
        this.closeDialog();
        this.getAddresses(this.userId); 
        this.showSuccess('Address added succesfully.');
      }, (error) => {
        console.error('Error updating address:', error);
      });
    } else {
      this.userService.addAddress(this.userId, this.newAddress).subscribe(() => {
        this.closeDialog();
        this.getAddresses(this.userId); 
        this.showSuccess('Address added succesfully.');
      }, (error) => {
        console.error('Error adding new address:', error);
      });
    }
  }

  deleteAddress(addressId: number) {
    console.log("Deleting user with ID:", addressId);  
    const ok = confirm("Are you sure you want to delete this address?");
    if (ok) {
      this.userService.deleteAddress(addressId).subscribe((result) => {
        this.getAddresses(this.userId); 
        this.showSuccess('Address deleted succesfully.');
      }, (error) => {
        console.error('Error deleting address:', error);
      });
    }
  }

  updateAddress() {
    if (this.addressForm.invalid) {
      this.showInvalid('Provide all fields with valid data');
      return;
    }

    const model: Address = this.addressForm.value;
    this.userService.updateAddress(this.editAddressId, model).subscribe((result) => {
      this.showSuccess('Address Updated Successfully');
      this.router.navigateByUrl('/users');
    });
  }

  setDefaultAddress(addressId: string) {
    this.userService.setDefaultAddress(this.userId, addressId).subscribe(() => {
      this.showSuccess('Default address updated successfully');
      this.getAddresses(this.userId);
    }, (error) => {
      console.error('Error setting default address:', error);
    });
  }  

  getAddresses(userId: string) {
    this.ngOnInit();
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
