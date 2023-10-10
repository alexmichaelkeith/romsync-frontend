import { Component } from '@angular/core';
import { AuthService } from 'src/app/AuthService';
import { API_URL } from 'src/app/constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router) {}

  email: string = '';
  password: string = '';
  
  onSubmit() {
      fetch(
        API_URL +
          '/users?' +
          new URLSearchParams({
            email: this.email,
            password: this.password
          }),
        { method: 'get' }
      )
        .then(res => {
          if (!res.ok) {
            throw res;
          }
          return res.text()
        })
        .then(token => {
          this.authService.saveToken(token);
          this.router.navigate(['']);
        })
        .catch(async err => {
          const body = await err;
        });
  }

}
