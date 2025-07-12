import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { UserModel } from '../models/UserModel';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login and store token and navigate based on role', () => {
      const mockUser: UserModel = {
        userId: '123',
        username: 'testuser',
        role: 'Voter',
        token: 'dummy.token.voter',
        refreshToken: 'refresh.token'
      };

      service.login('testuser', 'password').subscribe((user) => {
        expect(user).toEqual(mockUser);
        expect(localStorage.getItem('token')).toBe(mockUser.token);
        expect(localStorage.getItem('refreshToken')).toBe(mockUser.refreshToken);
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/voter']);
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}Authentication`);
      expect(req.request.method).toBe('POST');
      req.flush(mockUser);
    });
  });

  it('should return null if no token is available in getToken', () => {
    expect(service.getToken()).toBeNull();
  });

  it('should return true if token is set', () => {
    localStorage.setItem('token', 'dummy.token');
    (service as any).tokenSubject.next('dummy.token');
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should decode token and get role/username', () => {
    const payload = btoa(JSON.stringify({ role: 'Admin', nameid: 'adminuser' }));
    const token = `header.${payload}.signature`;
    localStorage.setItem('token', token);
    (service as any).tokenSubject.next(token);

    expect(service.getRole()).toBe('Admin');
    expect(service.getUsername()).toBe('adminuser');
  });

  it('should logout, remove tokens and navigate to login', () => {
    localStorage.setItem('token', 't1');
    localStorage.setItem('refreshToken', 'r1');

    service.logout();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}Authentication/logout`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ refreshToken: 'r1' });

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should return current user from decoded token', () => {
    const payload = {
      UserId: 'u1',
      nameid: 'testuser',
      role: 'Moderator'
    };
    const token = `header.${btoa(JSON.stringify(payload))}.signature`;

    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', 'r-token');

    const user = service.getCurrentUser();

    expect(user?.userId).toBe('u1');
    expect(user?.username).toBe('testuser');
    expect(user?.role).toBe('Moderator');
  });

  it('should register an admin', () => {
    const adminData = { name: 'Admin' };

    service.registerAdmin(adminData).subscribe(res => {
      expect(res).toEqual({ success: true });
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}Admin/add`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(adminData);
    req.flush({ success: true });
  });

  it('should check email availability', () => {
    const email = 'test@example.com';

    service.checkEmail(email, true).subscribe(isAvailable => {
      expect(isAvailable).toBeTrue();
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}Voter/check-email?email=${email}&isVoter=true`);
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });
});
