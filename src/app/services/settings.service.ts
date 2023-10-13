
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {

  constructor() {}

  // Method to save the setting
  saveSetting(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  // Method to retrieve the setting
  getSetting(key: string): string {
    return localStorage.getItem(key) || "";
  }

}
