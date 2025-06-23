import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, retry, catchError, throwError } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    // Skip attaching the token for login/logout endpoints
    const isAuthRequest = req.url.includes('Authentication');

    // Attach Authorization header only if token is present and not an auth request
    const authReq = token && !isAuthRequest
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        })
      : req;

    return next.handle(authReq).pipe(
      retry(2), // Retry failed requests up to 2 times (excluding 4xx)
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Automatically log out on 401 Unauthorized
          // this.authService.logout();
          alert('Session expired. Please log in again.');
        }

        // Could extend to handle 403, 500, etc. globally if desired
        return throwError(() => error);
      })
    );
  }
}