import { Component } from '@angular/core';
import {MonthlyComponent} from '../cover/monthly/monthly.component';
import {TopBooksComponent} from '../book/top-books/top-books.component';
import {MatDialogTitle} from '@angular/material/dialog';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {MatDivider} from '@angular/material/divider';

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
    MatDivider
  ],
  templateUrl: './front.component.html',
  standalone: true,
  styleUrl: './front.component.scss'
})
export class FrontComponent {

}
