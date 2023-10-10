import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/AuthService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  username: string | null = this.authService.getToken();
  
  onLogOut = () => {
    this.authService.removeToken()
    this.router.navigate(['login']);
  }

  ngOnInit() {
    
  }
}
