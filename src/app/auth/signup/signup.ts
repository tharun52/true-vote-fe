import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';
import { passwordMatchValidator } from '../validators/password-match.validator';
import { ModeratorsList } from "../../moderator/moderators-list/moderators-list";
import { passwordValidator } from '../validators/password-validator';
import { checkEmailValidator } from '../validators/check-email-validator';
import { ToastService } from '../../shared/ToastService';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, FormsModule, ModeratorsList,RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  signupForm: FormGroup;
  error: string | null = null;
  showModerators: boolean = false;

  constructor(private http: HttpClient, private authService: AuthService, private toastService:ToastService) {
    this.signupForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        asyncValidators: [
          checkEmailValidator(this.authService, this.toastService, () => this.showModerators = true)
        ],
        updateOn: 'blur'
      }),
      age: new FormControl(null, [Validators.required, Validators.min(18)]),
      password: new FormControl('', [Validators.required, passwordValidator]),
      confirmPassword: new FormControl('', Validators.required)
    }, { validators: passwordMatchValidator });
  }

  public get name() { return this.signupForm.get('name'); }
  public get email() { return this.signupForm.get('email'); }
  public get age() { return this.signupForm.get('age'); }
  public get password() { return this.signupForm.get('password'); }
  public get confirmPassword() { return this.signupForm.get('confirmPassword'); }

  handleSignup() {
    if (this.signupForm.invalid) return;

    const { name, email, password, age } = this.signupForm.value;

    this.http.post(`${environment.apiBaseUrl}Voter/add`, { name, email, password, age }).subscribe({
      next: () => {
        this.authService.login(email, password).subscribe({
          next: () => {},
          error: err => this.error = 'Auto-login failed.'
        });
      },
      error: err => {
        this.error = err.error?.message || 'Signup failed';
      }
    });
  }
}
