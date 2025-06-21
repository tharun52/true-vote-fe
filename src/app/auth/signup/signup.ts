import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';
import { passwordMatchValidator } from '../validators/password-match.validator';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  signupForm: FormGroup;
  error: string | null = null;

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {
    this.signupForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      age: new FormControl(null, [Validators.required, Validators.min(1)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', Validators.required),
      }, 
      { validators: passwordMatchValidator }
    );
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
        // auto login after signup
        this.authService.login(email, password).subscribe({
          next: () => this.router.navigate(['/']),
          error: err => this.error = 'Auto-login failed.'
        });
      },
      error: err => {
        this.error = err.error?.message || 'Signup failed';
      }
    });
  }
}
