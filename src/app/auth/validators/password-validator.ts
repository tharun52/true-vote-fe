import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const hasMinLength = value.length >= 8;
    const hasNumber = /\d/.test(value);

    const errors: ValidationErrors = {};
    if (!hasMinLength) {
      errors['minLength'] = 'Password must be at least 8 characters long';
    }
    if (!hasNumber) {
      errors['numberRequired'] = 'Password must contain at least one number';
    }

    return Object.keys(errors).length ? errors : null;
  };
}
