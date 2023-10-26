import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { vcService } from 'src/app/services/vcService';
import { CronService } from 'src/app/services/cron-service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private vcService: vcService,
    private cronService: CronService
  ) {}

  username: string | null = this.authService.getToken();
  actions: any;

  startCron() {
    this.cronService.startCron();
  }

  onFullService() {
    this.vcService.fullService();
  }

  getvc() {
    return this.vcService;
  }

  onSync() {
    this.vcService.sync();
  }

  onDiff = async () => {
    this.vcService.generateActions();
  };

  ngOnInit() {
    this.cronService.startCron();
  }

  getvcService() {
    return this.vcService;
  }

  onLogOut = () => {
    this.authService.removeToken();
    this.router.navigate(['login']);
  };
}
