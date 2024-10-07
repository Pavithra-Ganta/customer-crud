import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import User from '../types/user';  // Assuming this is your User type definition
import Address from '../types/address';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = "http://localhost:3000";  // Base API URL
  private httpClient = inject(HttpClient);

  constructor() {}

  loginUser(email: string, password: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/login`, { email, password });
  }

  // Method to get all users
  getUsers(): Observable<User[]> { 
    return this.httpClient.get<User[]>(`${this.apiUrl}/users`);
  }

  // Method to get a specific user by ID
  showUser(id: string): Observable<User> { 
    return this.httpClient.get<User>(`${this.apiUrl}/users/show/${id}`);
  }

  // Method to get a specific user by ID
  getUser(id: string): Observable<User> { 
    return this.httpClient.get<User>(`${this.apiUrl}/users/${id}`);
  }

  // Method to add a new user
  addUser(user: User): Observable<User> {
    return this.httpClient.post<User>(`${this.apiUrl}/users`, user);
  }

  // Method to update a user by ID
  updateUser(id: string, user: User): Observable<void> {
    return this.httpClient.put<void>(`${this.apiUrl}/users/${id}`, user);
  }

  // Method to delete a user by ID
  deleteUser(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/users/${id}`);
  }

  // Method to add a new address
  addAddress(userId: string, address: Address): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/users/${userId}/addresses`, address);
  }

  // Method to delete an address by ID
  deleteAddress(addressId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/addresses/${addressId}`);
  }

  // In UserService
// Method to get addresses by user ID
getUserAddresses(userId: string): Observable<Address[]> {
  return this.httpClient.get<Address[]>(`${this.apiUrl}/users/${userId}/addresses`); // Adjust the URL as necessary
}

getAddress(userId: string): Observable<Address> {
  return this.httpClient.get<Address>(`${this.apiUrl}/users/${userId}/address`);
}

updateAddress(addressId: string, address: Address): Observable<void> {
  return this.httpClient.put<void>(`${this.apiUrl}/addresses/${addressId}`, address);
}

setDefaultAddress(userId: string, addressId: string): Observable<void> {
  return this.httpClient.put<void>(`${this.apiUrl}/users/${userId}/default-address/${addressId}`, {});
}

searchUsers(query: string): Observable<User[]> {
  return this.httpClient.get<User[]>(`${this.apiUrl}/search`, { params: { query } });
}

}
