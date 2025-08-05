import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-verify-magic-link',
  imports: [],
  templateUrl: './verify-magic-link.html',
  styleUrl: './verify-magic-link.css'
})
export class VerifyMagicLink {
  statusMessage = 'Verifying...';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit() {
    const email = this.route.snapshot.queryParamMap.get('email') ?? '';
    const token = this.route.snapshot.queryParamMap.get('token') ?? '';

    if (email && token) {
      this.authService.verifyMagicLink(email, token).subscribe({
        next: (res) => {
          this.statusMessage = 'Login successful! Redirecting...';
          // redirect happens automatically in AuthService
        },
        error: (err) => {
          this.statusMessage = 'Verification failed: ' + err.error;
        }
      });
    } else {
      this.statusMessage = 'Invalid link';
    }
  }

}