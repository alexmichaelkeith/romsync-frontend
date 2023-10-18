import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-settings-selector',
  templateUrl: './settings-selector.component.html',
  styleUrls: ['./settings-selector.component.scss']
})
export class SettingsSelectorComponent {


  
  @Input()
    selected: string = 'General'

    
}