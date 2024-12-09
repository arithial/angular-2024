import {Component} from '@angular/core';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.component.html',
  standalone: true,
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {

  constructor(private authService: AuthService) {
    this.authService.logout();
  }

}
