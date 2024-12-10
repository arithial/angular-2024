import {Directive, Input} from '@angular/core';
import {AbstractControl, ValidationErrors, Validator, ValidatorFn} from '@angular/forms';

@Directive({
  standalone: true,
  selector: '[appConfirmPassword]'
})
export class ConfirmPasswordDirective implements Validator {
  @Input('password') password: string = '';
  @Input('confirmPassword') confirmPassword: string = '';

  constructor() {
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.password ? confirmPassword()(control) : null;
  }

}

export function confirmPassword(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    return password && confirmPassword && password.value !== confirmPassword.value ? {confirmPassword: true} : null;
  };
}
