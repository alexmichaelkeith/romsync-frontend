import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  closeElectronWindow() {
    const ipcRenderer = (window as any).electron.ipcRenderer;
    ipcRenderer.send('close-main-window');
  }

  minimizeElectronWindow() {
    const ipcRenderer = (window as any).electron.ipcRenderer;
    ipcRenderer.send('minimize-main-window');
  }
}
