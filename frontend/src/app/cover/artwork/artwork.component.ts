import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-artwork',
  imports: [],
  templateUrl: './artwork.component.html',
  standalone: true,
  styleUrl: './artwork.component.scss'
})
export class ArtworkComponent {
  @Input('isbn') isbn!: string;
  @Input('size') size!: string;
  @Input('title') title!: string;


}
