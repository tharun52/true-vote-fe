import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login.component.ts',
  imports: [FormsModule, NgIf, ReactiveFormsModule],
  templateUrl: './login.component.ts.html',
  styleUrl: './login.component.ts.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {
    this.loginForm = new FormGroup({
      un: new FormControl('', Validators.required),
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
      next: () => this.router.navigate(['/']),
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
