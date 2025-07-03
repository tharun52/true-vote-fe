import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { AuthInterceptor } from './auth-interceptor';

describe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
        }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Authorization header if token is present and not an auth request', () => {
    const fakeToken = 'fake-jwt-token';
    authServiceSpy.getToken.and.returnValue(fakeToken);

    httpClient.get('/api/data').subscribe();

    const req = httpMock.expectOne('/api/data');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${fakeToken}`);
    req.flush({}); // respond with empty body
  });

  it('should NOT add Authorization header for Authentication requests', () => {
    authServiceSpy.getToken.and.returnValue('some-token');

    httpClient.post('/api/Authentication/login', { username: 'user', password: 'pass' }).subscribe();

    const req = httpMock.expectOne('/api/Authentication/login');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });
});
