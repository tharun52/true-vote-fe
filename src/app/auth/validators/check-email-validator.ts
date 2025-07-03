import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { debounceTime, switchMap, catchError, of } from 'rxjs';
import { AuthService } from '../auth.service';
import { ToastService } from '../../shared/ToastService';

export function checkEmailValidator(
  authService: AuthService,
  toastService: ToastService,
  onInvalidEmail: () => void,
  isVoter: boolean
): AsyncValidatorFn {
  return (control: AbstractControl) => {
    const email = control.value;
    if (!email) return of(null);

    return of(email).pipe(
      debounceTime(300),
      switchMap(email => authService.checkEmail(email, isVoter)),
      switchMap(exists => {
        if (!exists) {
          control.setErrors({ emailNotFound: true });

          if (isVoter) {
            toastService.show(
              "Email does not exist",
              "Your email is unknown to any of the moderators. Please contact a moderator to get added.",
              true
            );
          }
          else{
            toastService.show(
              "Email does not exist",
              "Your email is unknown. Please Sign up.",
              true
            );
          }
          onInvalidEmail();
        }
        return of(null);
      }),
      catchError(() => of(null)) 
    );
  };
}
