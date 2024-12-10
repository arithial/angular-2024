import { Component } from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [
    MatCard,
    MatCardTitle,
    MatCardHeader,
    MatCardContent,
    RouterLink
  ],
  templateUrl: './not-found.component.html',
  standalone: true,
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {

}
