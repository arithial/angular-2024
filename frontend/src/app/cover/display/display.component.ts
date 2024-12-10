import {Component, Input, OnInit} from '@angular/core';
import {ArtworkComponent} from '../artwork/artwork.component';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../../services/auth.service';

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
export class DisplayComponent implements OnInit {
  @Input('isbn') isbn: string ='';
  @Input('title') title: string ='';
  @Input('author') author: string ='';
  @Input('size') size = "M";
  @Input('bookId') bookId: string ='';
  isAuthenticated = false;
  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.isAuthenticated = this.authService.isLoggedIn();
  }
}
