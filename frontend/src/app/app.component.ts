import {Component, effect, OnChanges, OnInit, signal, SimpleChanges, WritableSignal} from '@angular/core';
import {RouterOutlet} from '@angular/router';

import {MatToolbar, MatToolbarRow} from '@angular/material/toolbar';
import {MatAnchor, MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {AuthService, authSignal, GUEST_USER, UserInfo} from '../services/auth.service';
import {User} from '../graphql/generated';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbar, MatToolbarRow, MatAnchor, MatMenu, MatMenuItem, MatButton, MatMenuTrigger],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})

export class AppComponent {
  title = "BookCover";
  curUser: WritableSignal<UserInfo | null> = signal(null);
  authSignal = authSignal;

  constructor(private authService: AuthService) {
    effect(() => {
      console.log("effect")
      if (!authSignal()) {
        console.log("authSignal")
        this.curUser.set(null);
      } else if (!this.curUser()) {
        this.updateCurUser();
      }
    });
  }

  private updateCurUser() {
    if (this.authService.isLoggedIn() && this.authSignal()) {
      console.log("updating");
      this.curUser.set(this.authService.currentUser());

    } else {
      console.log("nulling");
      this.curUser.set(null);
    }
  }
}
