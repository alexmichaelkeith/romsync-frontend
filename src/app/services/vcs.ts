import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { API_URL } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class VCSService {
  constructor(private authService: AuthService) {}

  username: string | null = this.authService.getToken();
  localFiles: any;
  remoteFiles: any;
  actions: any;

  onScan = async () => {
    const ipcRenderer = (window as any).electron.ipcRenderer;
    const directoryPath = '/Users/alexkeith/roms';
    ipcRenderer.invoke('scan-files', directoryPath).then((result: any) => {
      this.localFiles = result;
    });
  };

  onRemote = async () => {
    await fetch(
      API_URL +
        '/data?' +
        new URLSearchParams({
          directory: 'akeithx',
          authorization: this.authService.getToken() || ''
        }),
      {
        method: 'get',
        headers: { authorization: this.authService.getToken() || '' }
      }
    )
      .then(res => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then(fileDetails => {
        this.remoteFiles = fileDetails;
      })
      .catch(async err => {
        console.log('err');
      });
  };

  push = (action: any) => {
    const ipcRenderer = (window as any).electron.ipcRenderer;
    ipcRenderer
      .invoke('read-file', action.path)
      .then(async (fileDetails: any) => {
        // Create a FormData object
        const formData = new FormData();
        const blob = new Blob([fileDetails.file], {
          type: 'application/octet-stream'
        });
        // Append the file data to FormData
        formData.append('file', blob, action.fileName);
        fetch(API_URL + '/data', {
          method: 'POST',
          body: formData,
          headers: {
            enctype: 'application/octet-stream',
            fileName: action.fileName,
            user: 'akeithx',
            lastModified: action.lastModified,
            createdtime: action.createdtime
          }
        })
          .then(res => {
            if (!res.ok) {
              throw res;
            }
          })
          .catch(async err => {
            console.log(await err);
          });
      });
  };

  pull = async (action: any) => {
    const ipcRenderer = (window as any).electron.ipcRenderer;
    const fileDetails = {
      fileName: action.fileName,
      authorization: this.authService.getToken()
    };
    ipcRenderer.invoke('create-file', fileDetails).then((res: any) => {});
  };

  generateDiffActions = async () => {
    await this.onScan();
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
    return this.actions;
  };
}
