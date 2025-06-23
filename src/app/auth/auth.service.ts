import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { UserModel } from '../models/UserModel';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenSubject = new BehaviorSubject<string | null>(null);
  token$ = this.tokenSubject.asObservable();
  private API = environment.apiBaseUrl + 'Authentication';

  constructor(private http: HttpClient, private router: Router) {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      this.tokenSubject.next(savedToken);
    }
  }

  login(username: string, password: string): Observable<UserModel> {
    return this.http.post<UserModel>(this.API, { username, password }).pipe(
      tap((user) => {
        // Store only the token (and refreshToken if needed)
        localStorage.setItem('token', user.token);
        localStorage.setItem('refreshToken', user.refreshToken);
        this.tokenSubject.next(user.token);

        // Redirect based on role
        if (user.role === 'Moderator') {
          this.router.navigate(['/moderator']);
        } else if (user.role === 'Voter') {
          this.router.navigate(['/voter']);
        } else {
          this.router.navigate(['/']);
        }
      })
    );
  }

  logout(): void {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      this.http.post(`${this.API}/logout`, { refreshToken }).subscribe();
    }
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.tokenSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.tokenSubject.value || localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.tokenSubject.value;
  }


  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (e) {
      return null;
    }
  }

  getRole(): string | null {
    const token = this.getToken();
    const decoded = token ? this.decodeToken(token) : null;
    return decoded?.role || null;
  }

  getUsername(): string | null {
    const token = this.getToken();
    const decoded = token ? this.decodeToken(token) : null;
    return decoded?.nameid || null;
  }

  getCurrentUser(): UserModel | null {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      const userId = payload?.UserId || '';
      const username = payload?.nameid || '';
      const role = payload?.role || '';

      return new UserModel(userId, username, role, token, refreshToken || '');
    }
    catch (err) {
      return null;
    }
  }

}
