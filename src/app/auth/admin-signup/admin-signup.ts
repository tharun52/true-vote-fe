import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordValidator } from '../validators/password-validator';
import { passwordMatchValidator } from '../validators/password-match.validator';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-admin-signup',
  imports: [FormsModule, ReactiveFormsModule, JsonPipe],
  templateUrl: './admin-signup.html',
  styleUrl: './admin-signup.css'
})
export class AdminSignup {
  error = '';

  AdminSignUpForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    password: new FormControl('', [Validators.required, passwordValidator]),
    confirmPassword: new FormControl('', Validators.required),
    seceretAdminKey: new FormControl('', Validators.required)
  },
  {validators:passwordMatchValidator});

  constructor(private authService:AuthService, private http: HttpClient, private router:Router)
  {}

  public get name() { return this.AdminSignUpForm.get('name'); }
  public get email() { return this.AdminSignUpForm.get('email'); }
  public get password() { return this.AdminSignUpForm.get('nampassworde'); }
  public get confirmPassword() { return this.AdminSignUpForm.get('confirmPassword'); }  
  public get seceretAdminKey() { return this.AdminSignUpForm.get('seceretAdminKey'); }

  handleAdminSignup() {
      if (this.AdminSignUpForm.invalid) return;
  
      const { name, email, password, seceretAdminKey } = this.AdminSignUpForm.value;

      if (!name || !email || !password || !seceretAdminKey) {
        this.error = 'Form is invalid.';
        return;
      }
      
      const adminData = { name, email, password, seceretAdminKey};
      
      this.authService.registerAdmin(adminData).subscribe({
        next:res =>{
          this.authService.login(email, password).subscribe({
            next: () => {},
            error: err => this.error = 'Auto-login failed.'
          });
          this.router.navigateByUrl('admin');
        },
        error:err => {
          this.error = err
        }
      });
   }
}
