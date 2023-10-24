import { Injectable } from '@angular/core';
import { vcService } from './vcService';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class CronService {
  constructor(
    private vcService: vcService,
    private settingsService: SettingsService
  ) {}

  interval: any;

  startCron() {
    clearInterval(this.interval);
    const frequency =
      parseInt(this.settingsService.getSetting('cron')) * 60000 || 0;
    this.interval = setInterval(async () => {
      this.vcService.fullService();
    }, frequency);
    if (frequency <= 0) {
      clearInterval(this.interval);
    }
  }
}
