import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { UserModel } from '../models/UserModel';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<UserModel | null>(null);
  user$ = this.userSubject.asObservable();
  private API = environment.apiBaseUrl + 'api/v1/Authentication';

  constructor(private http: HttpClient, private router: Router) {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.userSubject.next(JSON.parse(savedUser));
    }
  }

  login(username: string, password: string): Observable<UserModel> {
    return this.http.post<UserModel>(this.API, { username, password }).pipe(
      tap((user) => {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        // Redirect based on role
        if (user.role === 'Moderator') {
          this.router.navigate(['/moderator']);
        } else {
          this.router.navigate(['/']); 
        }
      })
    );
  }

  logout(): void {
    const refreshToken = this.userSubject.value?.refreshToken;
    if (refreshToken) {
      this.http.post(`${this.API}/logout`, { refreshToken }).subscribe();
    }
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): UserModel | null {
    return this.userSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }
}
