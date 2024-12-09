import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.component.html',
  standalone: true,
  styleUrl: './logout.component.scss'
})
export class LogoutComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) {

  }

  ngOnInit() {
    this.authService.logout();
    this.router.navigateByUrl('');
  }

}
