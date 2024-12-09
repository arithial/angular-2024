import {Component, Input} from '@angular/core';
import {ArtworkComponent} from '../artwork/artwork.component';

@Component({
  selector: 'app-display',
  imports: [
    ArtworkComponent
  ],
  templateUrl: './display.component.html',
  standalone: true,
  styleUrl: './display.component.scss'
})
export class DisplayComponent {
  @Input('isbn') isbn: string | undefined;
  @Input('title') title: string | undefined;
  @Input('author') author: string | undefined;
  @Input('size') size = "M";
}
