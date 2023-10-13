
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authTokenKey = 'authToken'; // Key to store the token in local storage or session storage

  constructor() {}

  // Method to save the JWT token
  saveToken(token: string): void {
    localStorage.setItem(this.authTokenKey, token); // You can also use sessionStorage
  }

  // Method to retrieve the JWT token
  getToken(): string | null {
    return localStorage.getItem(this.authTokenKey); // You can also use sessionStorage
  }

  // Method to remove the JWT token
  removeToken(): void {
    localStorage.removeItem(this.authTokenKey); // You can also use sessionStorage
  }
  loggedIn(): boolean {
    if (this.getToken()) {
      return true
    }
    return false
  }
}
