import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { API_URL } from 'src/app/constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router) {}

  username: string = '';
  password: string = '';
  error_message: string = '';

  onSubmit() {
    fetch(API_URL + '/users?', {
      method: 'get',
      headers: {
        username: this.username,
        password: this.password
      }
    })
      .then(res => {
        if (!res.ok) {
          throw res;
        }
        return res.text();
      })
      .then(token => {
        this.authService.saveToken(token);
        this.router.navigate(['']);
      })
      .catch(async err => {
        this.error_message = await err.text();
      });
  }
}
