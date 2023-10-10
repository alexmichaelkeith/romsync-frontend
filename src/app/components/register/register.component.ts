import { Component } from '@angular/core';
import { API_URL } from 'src/app/constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class SignupComponent {
  constructor(private router: Router) {}

  email: string = '';
  password: string = '';
  error_message: string = '';

  onSubmit() {
    fetch(
      API_URL +
        '/users?' +
        new URLSearchParams({
          email: this.email,
          password: this.password
        }),
      { method: 'post' }
    )
      .then(res => {
        if (!res.ok) {
          throw res;
        }
        this.router.navigate(['login'])
      })
      .catch(async err => {
        this.error_message = await err.json();
      });
  }
}
