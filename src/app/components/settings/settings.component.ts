import { Component } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service'
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  constructor() {}

  settingsService = new SettingsService
  selectedOption: string = 'General'
  test: string = 'test'

  onNavClick(option: string) {

    if (option == 'General') {

      this.selectedOption = 'General'
    }
    else if (option == 'Appearance') {
      this.selectedOption = 'Appearance'
      //this.settingsService.saveSetting('testOption','savedSetting')
      this.test = this.settingsService.getSetting('testOption')

    }
    else if (option == 'File System') {
      this.selectedOption = 'File System'
    }
    else if (option == 'About') {
      this.selectedOption = 'About'
    }
  }
}
