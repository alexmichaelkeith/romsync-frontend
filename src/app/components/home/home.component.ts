import { Component, OnInit } from '@angular/core';
//mport { AuthService } from '../auth.service'; // Import your authentication service here

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  username: string = '';


  ngOnInit() {
    
  }
}
