import { Component } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    MatLabel,
    MatFormField,
    MatButton,
    MatInput
  ],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe({
      next: () => { /* Do nothing, as the service will handle it */},
      error: (error) => {},
      complete: () =>{}
    })
  }
}
