import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup;
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {
    this.loginForm = new FormGroup({
      un: new FormControl('', [Validators.required, Validators.email]),
      pass: new FormControl('', Validators.required),
    });
  }

  public get un() {
    return this.loginForm.get('un');
  }

  public get pass() {
    return this.loginForm.get('pass');
  }

  handleLogin() {
    if (this.loginForm.invalid) return;

    const username = this.un?.value;
    const password = this.pass?.value;

    this.authService.login(username, password).subscribe({
      next: () => {},
      error: (err) => {
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

