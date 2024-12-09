import {Component, Input} from '@angular/core';
import {ArtworkComponent} from '../artwork/artwork.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-display',
  imports: [
    ArtworkComponent,
    RouterLink
  ],
  templateUrl: './display.component.html',
  standalone: true,
  styleUrl: './display.component.scss'
})
export class DisplayComponent {
  @Input('isbn') isbn: string ='';
  @Input('title') title: string ='';
  @Input('author') author: string ='';
  @Input('size') size = "M";
  @Input('bookId') bookId: string ='';
}
