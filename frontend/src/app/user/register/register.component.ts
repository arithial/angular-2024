import {Component, inject} from '@angular/core';
import {FormGroup, ReactiveFormsModule, FormBuilder, Validators} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {AuthService} from '../../../services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton
  ],
  templateUrl: './register.component.html',
  standalone: true,
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  private _snackBar = inject(MatSnackBar);

  openSnackBar(message: string) {
    this._snackBar.open(message, "Ok", {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 2000,
    });
  }

  constructor(private fb: FormBuilder, private authService: AuthService) {

    const confirmPasswordValidator = (formGroup: FormGroup) => {
      const password = formGroup.get('password')?.value;
      const confirmPassword = formGroup.get('confirmPassword')?.value;

      return password === confirmPassword ? null : {mismatch: true};
    };

    this.registerForm = this.fb.group({
      username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required]
    },
    {
      validator: confirmPasswordValidator
    }

    );
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const {username,email, password} = this.registerForm.value;
      this.authService.createUser(username,email, password).subscribe({
        next: (response) => {
          if(!response.success)
          {
            this.openSnackBar(response.message);
            return;
          }
          console.log('User registered successfully', response);
        },
        error: (error: Error) => {
          this.openSnackBar(error.message);
        }
      });
    }
  }
}
