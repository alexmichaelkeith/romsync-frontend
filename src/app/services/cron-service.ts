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

  refresh: any;
  sync: any;

  startCron() {
    clearInterval(this.refresh);
    clearInterval(this.sync);
    const refreshFrequency =
      parseInt(this.settingsService.getSetting('refresh')) * 60000 || 0;
    const syncFrequency =
      parseInt(this.settingsService.getSetting('sync')) * 60000 || 0;
    this.refresh = setInterval(async () => {
      this.vcService.generateActions();
    }, refreshFrequency);
    if (refreshFrequency <= 0) {
      clearInterval(this.refresh);
    }
    this.sync = setInterval(async () => {
      this.vcService.fullService();
    }, syncFrequency);
    if (syncFrequency <= 0) {
      clearInterval(this.sync);
    }
  }
}
