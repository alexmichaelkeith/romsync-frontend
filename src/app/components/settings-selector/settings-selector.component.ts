import { Component, Input } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { CronService } from 'src/app/services/cron-service';
import { vcService } from 'src/app/services/vcService';
@Component({
  selector: 'app-settings-selector',
  templateUrl: './settings-selector.component.html',
  styleUrls: ['./settings-selector.component.scss']
})
export class SettingsSelectorComponent {
  constructor(
    private settingsService: SettingsService,
    private cronService: CronService,
    private vcService: vcService
  ) {}

  directory: string = this.settingsService.getSetting('directory');
  cron: number = parseInt(this.settingsService.getSetting('cron') || '0');
  filetype: string = '';

  @Input()
  selected: string = 'General';

  getVcService() {
    return this.vcService;
  }

  onDirectorySetting() {
    this.settingsService.saveSetting('directory', this.directory);
  }
  onCronSetting() {
    this.settingsService.saveSetting('cron', this.cron.toString());
    this.cronService.startCron();
  }
  onAddUntrack() {
    const filetypes = this.settingsService.getSetting('filetypes')
      ? (this.vcService.filetypes = JSON.parse(
          this.settingsService.getSetting('filetypes')
        ))
      : [];

    !filetypes.includes(this.filetype)
      ? filetypes.push(this.filetype)
      : undefined;

    this.settingsService.saveSetting('filetypes', JSON.stringify(filetypes));
    this.vcService.filetypes = filetypes;
  }
  onRemoveFiletype(filetype: string) {
    this.vcService.filetypes = this.vcService.filetypes.filter(
      (savedType: string) => savedType != filetype
    );
    this.settingsService.saveSetting(
      'filetypes',
      JSON.stringify(this.vcService.filetypes)
    );
  }
}
