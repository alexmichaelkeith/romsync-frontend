import { Component } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  username: string = '';
  email: string = '';
  password: string = '';

  onSubmit() {
    console.log('Full Name:', this.username);
    console.log('Email:', this.email);
    console.log('Password:', this.password);


    



    window.location.href= '/login';
  }
}
