import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastService } from '../../shared/ToastService';
import { checkEmailValidator } from '../validators/check-email-validator';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup;
  error: string | null = null;
  emailBlurred = false;

  loading: boolean = false;

  constructor(private authService: AuthService, private toastService: ToastService) {
    this.loginForm = new FormGroup({
      un: new FormControl(
        '',
        {
          validators: [Validators.required, Validators.email],
          asyncValidators: [
            checkEmailValidator(this.authService, this.toastService, () => {
              this.loginForm.get('un')?.setErrors({ emailNotFound: true });
            }, false)
          ],
          updateOn: 'blur' 
        }
      ),
      pass: new FormControl('', Validators.required)
    });
  }


  public get un() {
    return this.loginForm.get('un');
  }

  public get pass() {
    return this.loginForm.get('pass');
  }

  handleLogin() {
    if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();

    const emailErrors = this.loginForm.get('un')?.errors;
    if (emailErrors?.['emailNotFound']) {
      this.toastService.show(
        "Email not found",
        "Please sign up or contact support.",
        true
      );
    }

    return;
  }

    const username = this.un?.value;
    const password = this.pass?.value;

    this.loading = true;

    this.authService.login(username, password).subscribe({
      next: () => {
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        if (typeof err.error === 'string') {
          this.error = err.error;
        } else if (typeof err.error === 'object') {
          this.error = err.error.message || 'Login failed';
        } else {
          this.error = 'Login failed';
        }
      }
    });
  }
}

