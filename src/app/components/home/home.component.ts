import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  username: string | null = this.authService.getToken();
  files: any
  onLogOut = () => {
    this.authService.removeToken()
    this.router.navigate(['login']);
  }

  onClick = () => {
    const ipcRenderer = (window as any).electron.ipcRenderer;
    const directoryPath = '/Users/alexkeith/roms'
    ipcRenderer.invoke('filesystem-scan', directoryPath).then((result: any) => {
    this.files = result.map((file: any)=>file.fileName)
    })
  }

  ngOnInit() {
    
  }
}
