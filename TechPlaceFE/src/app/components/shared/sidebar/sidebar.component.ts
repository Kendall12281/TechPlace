import { Component, Input } from '@angular/core';
import { ToggleService } from '../header/toggle.service';
import { UsuarioModel } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() user: UsuarioModel | null;
  panelOpenState = false;

  isToggled = false;

  constructor(
      private toggleService: ToggleService
  ) {
      this.toggleService.isToggled$.subscribe(isToggled => {
          this.isToggled = isToggled;
      });
  }

  toggle() {
      this.toggleService.toggle();
  }
}
