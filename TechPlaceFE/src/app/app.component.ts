import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToggleService } from '../app/components/shared/header/toggle.service';
import { AuthService } from './services/autenticacion.service';
import { UsuarioModel } from './models/usuario.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'TechPlace';
  isToggled = false;
  user: UsuarioModel | null;
    constructor(
        public router: Router,
        private toggleService: ToggleService,
        private authenticationService : AuthService
    ) {
        this.toggleService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

  ngOnInit(): void {
    this.loadUserData();
    this.authenticationService.refreshEvent.subscribe(() => {
      this.loadUserData();
    });
  }

  async loadUserData(){
    this.user = this.authenticationService.userData();
  }
}
