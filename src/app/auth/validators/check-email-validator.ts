// email-check.validator.ts
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { debounceTime, switchMap, catchError, of } from 'rxjs';
import { AuthService } from '../auth.service';
import { ToastService } from '../../shared/ToastService';


export function checkEmailValidator(
  authService: AuthService,
  toastService: ToastService,
  onInvalidEmail: () => void
): AsyncValidatorFn {
  return (control: AbstractControl) => {
    const email = control.value;
    if (!email) return of(null);

    return of(email).pipe(
      debounceTime(300),
      switchMap(email => authService.checkEmail(email)),
      switchMap(exists => {
        if (!exists) {
          toastService.show("Email Does not exits", "You email is unknown to any of the moderator, please contact the moderator so that they could add your email", true);
          onInvalidEmail();
        }
        return of(null); 
      }),
      catchError(() => of(null)) 
    );
  };
}
