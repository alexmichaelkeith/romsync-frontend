import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { VCSService } from 'src/app/services/vcsService';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router, private vcsService: VCSService) {}

  username: string | null = this.authService.getToken();
  actions: any
  
  onSync() {
    this.actions.forEach(async (action: any)=> {
      if (action.action == 'push') {
        await this.vcsService.push(action)
      }
      if (action.action == 'pull') {
        this.vcsService.pull(action)
      }
    })

  }

  onDiff = async () => {
    this.actions = await this.vcsService.generateDiffActions()
  }

  ngOnInit() {
    
  }

  getVcsService() {
    return this.vcsService;
  }

  onLogOut = () => {
    this.authService.removeToken()
    this.router.navigate(['login']);
  }
}
