import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login.component.ts',
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.ts.html',
  styleUrl: './login.component.ts.css'
})
export class LoginComponent {
  username = '';
  password = '';
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) 
  {}
  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => (this.error = err.error),
    });
  }
}
