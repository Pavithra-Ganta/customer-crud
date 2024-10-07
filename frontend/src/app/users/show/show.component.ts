import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import User from '../../types/user';
import { CommonModule } from '@angular/common';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButton, MatButtonModule } from '@angular/material/button';
import Address from '../../types/address';

@Component({
  selector: 'app-show',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatIconModule, RouterLink, MatButtonModule],
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css'],
})
export class ShowComponent {
  user: User | null=null; // Single user object
  address: Address | null=null;
  userService = inject(UserService);
  route = inject(ActivatedRoute);
  userId!: string;

  ngOnInit() {
    this.userId = this.route.snapshot.params['id'];
    this.userService.showUser(this.userId).subscribe((result: User) => {
      this.user = result;
      console.log(this.user);
    }, (error) => {
      console.error('Error fetching user details:', error);
    });
    this.userService.getAddress(this.userId).subscribe((result: Address) => {
      this.address = result;
      if (this.address) {
        console.log('Default address:', this.address);
      } else {
        console.log('No default address found');
      }
    }, (error) => {
      console.error('Error fetching address details:', error);
    });    
  }
}

  