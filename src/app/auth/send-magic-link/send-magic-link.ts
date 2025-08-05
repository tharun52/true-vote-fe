import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../shared/ToastService';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-send-magic-link',
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './send-magic-link.html',
  styleUrl: './send-magic-link.css'
})
export class SendMagicLink {
  magicLinkForm: FormGroup;
  isLoading = false;

  constructor(private authService: AuthService, private toastService:ToastService) {
    this.magicLinkForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  get email() {
    return this.magicLinkForm.get('email');
  }

  sendLink() {
    if (this.magicLinkForm.invalid) {
      this.magicLinkForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const clientURI = `${window.location.origin}/verify-magic-link`;

    this.authService.sendMagicLink(this.email?.value, clientURI).subscribe({
      next: (res: any) => {
        console.log('Magic link sent successfully', res);
        this.isLoading = false;
        this.toastService.show("Link Sent Successfully", "If the email exists, a link has been sent successfully. Check your Email !", false);
      },
      error: (err) => {
        console.error('Error while sending magic link:', err);
        this.isLoading = false;
        this.toastService.show("Error in sending the link", "Something went wrong while sending the link to your email. Please try again in sometime.", false);
      }
    });
  }


}
