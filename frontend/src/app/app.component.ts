import {Component, effect, OnChanges, OnInit, signal, SimpleChanges, WritableSignal} from '@angular/core';
import {RouterOutlet} from '@angular/router';

import {MatToolbar, MatToolbarRow} from '@angular/material/toolbar';
import {MatAnchor} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {AuthService, authSignal} from '../services/auth.service';
import {User} from '../graphql/generated';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatIcon, MatToolbar, MatToolbarRow, MatAnchor],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})

export class AppComponent {
  title = "BookCover";
  curUser: WritableSignal<User | null> = signal(null);
  authSignal = authSignal;

  constructor(private authService: AuthService) {
    effect(() => {
      console.log("effect")
      if (!authSignal()) {
        console.log("authSignal")
        this.curUser.set(null);
      } else if(!this.curUser()) {
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
