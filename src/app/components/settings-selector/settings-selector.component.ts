import { Component, Input } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { CronService } from 'src/app/services/cron-service';
@Component({
  selector: 'app-settings-selector',
  templateUrl: './settings-selector.component.html',
  styleUrls: ['./settings-selector.component.scss']
})
export class SettingsSelectorComponent {
  constructor(private settingsService: SettingsService, private cronService: CronService) {}

  directory: string = this.settingsService.getSetting('directory');
  cron: number = parseInt(this.settingsService.getSetting('cron') || '0') 

  @Input()
  selected: string = 'General';

  onDirectorySetting() {
    this.settingsService.saveSetting('directory', this.directory);
  }
  onCronSetting() {
    this.settingsService.saveSetting('cron', this.cron.toString());
    this.cronService.startCron()
  }
}
