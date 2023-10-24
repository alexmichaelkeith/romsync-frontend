import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { API_URL } from '../constants';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class vcService {
  constructor(
    private authService: AuthService,
    private settingsService: SettingsService
  ) {}

  username: string | null = this.authService.getToken();
  localFiles: any;
  remoteFiles: any;
  actions: any;

  ngOnInit() {}

  onScan = () => {
    return new Promise((resolve, reject) => {
      const ipcRenderer = (window as any).electron.ipcRenderer;
      ipcRenderer
        .invoke('scan-files', this.settingsService.getSetting('directory'))
        .then((res: any) => {
          this.localFiles = res;
          resolve((res: any) => resolve('Scan Succesful'));
        })
        .catch((err: any) => reject(err));
    });
  };

  onRemote = async () => {
    return new Promise(async (resolve, reject) => {
      await fetch(API_URL + '/data?', {
        method: 'get',
        headers: { authorization: this.authService.getToken() || '' }
      })
        .then(res => {
          if (!res.ok) {
            throw res;
          }
          return res.json();
        })
        .then(fileDetails => {
          this.remoteFiles = fileDetails;
          resolve('Remote Files Received');
        })
        .catch(async err => {
          reject('Remote Files Not Received');
        });
    });
  };

  async push(action: any) {
    try {
      const ipcRenderer = (window as any).electron.ipcRenderer;
      const fileDetails = await ipcRenderer.invoke('read-file', action.path);

      const formData = new FormData();
      const blob = new Blob([fileDetails.file], {
        type: 'application/octet-stream'
      });
      formData.append('file', blob, action.fileName);

      const response = await fetch(API_URL + '/data', {
        method: 'POST',
        body: formData,
        headers: {
          enctype: 'application/octet-stream',
          fileName: action.fileName,
          user: 'akeithx',
          authorization: this.authService.getToken() || '',
          lastModified: action.lastModified,
          createdtime: action.createdtime
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      return 'File Pushed';
    } catch (error) {
      console.error('Error pushing file:', error);
      throw new Error('File not Pushed');
    }
  }

  pull = async (action: any) => {
    try {
      const ipcRenderer = (window as any).electron.ipcRenderer;
      const fileDetails = {
        fileName: action.fileName,
        authorization: this.authService.getToken(),
        path:
          this.settingsService.getSetting('directory') + '/' + action.fileName
      };

      // Use await directly with ipcRenderer.invoke and catch any errors.
      await ipcRenderer.invoke('create-file', fileDetails);

      return 'File Pulled'; // Resolving the promise with a success message.
    } catch (error) {
      throw error; // Rethrow the error so that it can be caught in the parent function.
    }
  };

  generateDiffActions() {
    return new Promise(async (resolve, reject) => {
      await this.onScan()
      await this.onRemote();

      this.actions = [];

      // Calculate files to push (local files not in the remote)
      const filesToPush = this.localFiles.filter(
        (localFile: any) =>
          !this.remoteFiles.some(
            (remoteFile: any) =>
              remoteFile.fileName === localFile.fileName &&
              remoteFile.lastModified >= localFile.lastModified
          )
      );

      // Calculate files to pull (remote files not in the local)
      const filesToPull = this.remoteFiles.filter(
        (remoteFile: any) =>
          !this.localFiles.some(
            (localFile: any) =>
              localFile.fileName === remoteFile.fileName &&
              localFile.lastModified >= remoteFile.lastModified
          )
      );

      // Add push actions to the diff array
      filesToPush.forEach((file: any) => {
        this.actions.push({
          action: 'push',
          fileName: file.fileName,
          path: file.path,
          lastModified: file.lastModified,
          createdtime: file.createdtime
        });
      });

      // Add pull actions to the diff array
      filesToPull.forEach((file: any) => {
        this.actions.push({
          action: 'pull',
          fileName: file.fileName,
          path: file.path,
          lastModified: file.lastModified,
          createdtime: file.createdtime
        });
      });
      resolve('Done Generating Actions');
    });
  }

  async sync() {
    for (const action of this.actions) {
      if (action.action === 'push') {
        await this.push(action);
      } else {
        await this.pull(action);
      }
    }
    return;
  }

  async fullService() {
    try {
      await this.generateDiffActions();
      await this.sync();
      await this.generateDiffActions();
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }
}
