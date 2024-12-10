import {Component, OnInit, signal} from '@angular/core';
import {MonthlyComponent} from '../cover/monthly/monthly.component';
import {TopBooksComponent} from '../book/top-books/top-books.component';
import {MatDialogTitle} from '@angular/material/dialog';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {MatDivider} from '@angular/material/divider';
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {FrontService} from './front.service';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-front',
  imports: [
    MonthlyComponent,
    TopBooksComponent,
    MatCardTitle,
    MatCard,
    MatCardSubtitle,
    MatCardContent,
    MatCardHeader,
    MatDivider,
    MatIcon,
    MatIconButton
  ],
  templateUrl: './front.component.html',
  standalone: true,
  styleUrl: './front.component.scss'
})
export class FrontComponent implements OnInit {

  isAdmin = signal(false);

  constructor(private frontService: FrontService,
              private router: Router,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.isAdmin.set(this.authService.currentUser().isAdmin);
  }

  finalise() {
    this.frontService.finaliseVote().subscribe(
      (data) => {
        if (data) {
          if (data.success) {
            this.router.navigate(['/']);
          }
        }
      });
  }

}
