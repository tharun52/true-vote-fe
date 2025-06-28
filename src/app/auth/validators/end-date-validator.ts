import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function endDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null; 
    }

    const selectedDate = new Date(value);
    const currentDate = new Date();

    selectedDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    if (selectedDate < currentDate) {
      return { endDatePastError: 'End Date Cannot be before today' };
    }

    return null;
  };
}
