import {Component} from '@angular/core';
import {FormGroup, ReactiveFormsModule, FormBuilder, Validators} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {AuthService} from '../../../services/auth.service';

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
          console.log('User registered successfully', response);
        },
        error: (error) => {
          console.error('Registration failed', error);
        }
      });
    }
  }
}
