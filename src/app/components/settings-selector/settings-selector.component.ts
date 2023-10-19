import { Component, Input } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-settings-selector',
  templateUrl: './settings-selector.component.html',
  styleUrls: ['./settings-selector.component.scss']
})
export class SettingsSelectorComponent {
  constructor(private settingsService: SettingsService) {}

  directory: string = this.settingsService.getSetting('directory');

  @Input()
  selected: string = 'General';

  onDirectorySetting() {
    this.settingsService.saveSetting('directory', this.directory);
  }
}
