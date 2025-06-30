import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModeratorService } from '../../moderator/moderator.service';
import { Router } from '@angular/router';
import { ToastService } from '../../shared/ToastService';
import { passwordValidator } from '../../auth/validators/password-validator';

@Component({
  selector: 'app-add-moderator',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './add-moderator.html',
  styleUrl: './add-moderator.css'
})
export class AddModerator {
  moderatorForm: FormGroup;
  responseMessage = '';

  constructor(private moderatorService: ModeratorService, private router:Router, private toastService:ToastService) {
    this.moderatorForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.email),
      password: new FormControl('', [Validators.required, passwordValidator])
    });
  }
  
  public get name() {return this.moderatorForm.get('name');}
  public get email() {return this.moderatorForm.get('email');}
  public get password() {return this.moderatorForm.get('password');}

  submit() {
    if (this.moderatorForm.invalid) {
      this.responseMessage = 'Please fill all required fields.';
      return;
    }

    const moderatorData = this.moderatorForm.value;

    this.moderatorService.addModerator(moderatorData).subscribe({
      next: (res) => {
        this.toastService.show('Success', '✅ Moderator added successfully!', false);
        this.router.navigate(['/admin']); 
      },
      error: (err) => {
        this.toastService.show('Error', '❌ Failed to add moderator.', true);
        console.error(err);
      }
    });
  }
}
