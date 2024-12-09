import {Component, OnInit, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';

import {MatToolbar, MatToolbarRow} from '@angular/material/toolbar';
import {MatAnchor} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {User} from '../graphql/generated';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,MatIcon, MatToolbar, MatToolbarRow, MatAnchor],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = "BookCover";
  user: User | null = null;
  auth = signal(false);


  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.auth = this.authService.getAuthSignal();
  }
}
