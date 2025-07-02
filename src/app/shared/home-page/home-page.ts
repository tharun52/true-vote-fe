import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage {
  constructor(private authService:AuthService, private router:Router)
  {}
  ngOnInit() {
    const role = this.authService.getRole()?.toLowerCase();
    const isLoggedIn = this.authService.isLoggedIn();

    if (isLoggedIn && role) {
      this.router.navigate([`/${role}`]);
    }
  }
}
