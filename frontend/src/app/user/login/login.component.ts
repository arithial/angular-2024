import {Component} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {HttpStatusCode} from '@angular/common/http';
import {Router} from '@angular/router';

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
  errorMessage: string = '';
  error = false;


  constructor(private authService: AuthService, private router: Router) {

  }

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log("login")
        this.error = !response.success;
        if (!response.success) {
          if (HttpStatusCode.Unauthorized.valueOf() == response.code) {
            this.errorMessage = "Username or password does not match";
          }
          else
          {
            this.errorMessage = "Unknown error has occured";
          }
        }
        else
        {
          this.errorMessage = '';
          this.router.navigate(['/']);

        }
      },
      error: (error) => {
        this.error = true;
        this.errorMessage = error.message;
      },
      complete: () => {
      }
    })
  }
}
