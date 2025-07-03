import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { UserModel } from '../models/UserModel';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;
    let routerSpy: jasmine.SpyObj<Router>;

    const dummyUser: UserModel = new UserModel(
        '1',
        'testuser',
        'Voter',
        'dummyToken.jwt.token',
        'dummyRefreshToken'
    );

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
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should login and store tokens', () => {
        service.login('testuser', 'password123').subscribe(user => {
            expect(user).toEqual(dummyUser);
            expect(localStorage.getItem('token')).toBe(dummyUser.token);
            expect(localStorage.getItem('refreshToken')).toBe(dummyUser.refreshToken);
        });

        const req = httpMock.expectOne(`${environment.apiBaseUrl}Authentication`);
        expect(req.request.method).toBe('POST');
        req.flush(dummyUser);

        expect(routerSpy.navigate).toHaveBeenCalledWith(['/voter']);
    });

    it('should logout and clear tokens', () => {
        localStorage.setItem('token', 'testToken');
        localStorage.setItem('refreshToken', 'testRefreshToken');

        service.logout();

        const req = httpMock.expectOne(`${environment.apiBaseUrl}Authentication/logout`);
        expect(req.request.method).toBe('POST');
        req.flush({});

        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('refreshToken')).toBeNull();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should return the token from localStorage', () => {
        localStorage.setItem('token', 'storedToken');

        service = TestBed.inject(AuthService);

        const token = service.getToken();
        expect(token).toBe('storedToken');
    });

    it('should return isLoggedIn as true if token exists', () => {
        localStorage.setItem('token', 'storedToken');
        service = TestBed.inject(AuthService);
        expect(service.isLoggedIn()).toBeTrue();
    });

    it('should decode token and return correct role', () => {
        const mockPayload = { role: 'Admin' };
        const encoded = btoa(JSON.stringify(mockPayload));
        const token = `header.${encoded}.signature`;

        localStorage.setItem('token', token);
        service = TestBed.inject(AuthService);

        expect(service.getRole()).toBe('Admin');
    });

    it('should decode token and return correct username', () => {
        const mockPayload = { nameid: 'testuser' };
        const encoded = btoa(JSON.stringify(mockPayload));
        const token = `header.${encoded}.signature`;

        localStorage.setItem('token', token);
        service = TestBed.inject(AuthService);

        expect(service.getUsername()).toBe('testuser');
    });

    it('should return current user from token', () => {
        const payload = {
            nameid: 'john',
            role: 'Moderator',
            UserId: '10'
        };
        const encoded = btoa(JSON.stringify(payload));
        const token = `header.${encoded}.signature`;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', 'refToken');

        const user = service.getCurrentUser();
        expect(user?.username).toBe('john');
        expect(user?.role).toBe('Moderator');
        expect(user?.token).toBe(token);
    });

    it('should call checkEmail with correct email', () => {
        const email = 'test@example.com';

        service.checkEmail(email).subscribe(res => {
            expect(res).toBeTrue();
        });

        const req = httpMock.expectOne(`${environment.apiBaseUrl}Voter/check-email?email=${email}`);
        expect(req.request.method).toBe('GET');
        req.flush(true);
    });

    it('should call registerAdmin with admin data', () => {
        const adminData = { name: 'Admin', email: 'admin@test.com' };

        service.registerAdmin(adminData).subscribe(res => {
            expect(res).toEqual({ success: true });
        });

        const req = httpMock.expectOne(`${environment.apiBaseUrl}Admin/add`);
        expect(req.request.method).toBe('POST');
        req.flush({ success: true });
    });
});
