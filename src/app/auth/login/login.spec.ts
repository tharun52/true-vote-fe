import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ToastService } from '../../shared/ToastService';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);

    await TestBed.configureTestingModule({
      imports: [Login, ReactiveFormsModule],
      providers: [
        { provide: ActivatedRoute, useValue: {} }, 
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should not login if form is invalid', () => {
    component.loginForm.setValue({ un: '', pass: '' });
    component.handleLogin();
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should login successfully if form is valid', () => {
    component.loginForm.setValue({ un: 'user@example.com', pass: 'Password123' });

    authServiceSpy.login.and.returnValue(of({
      userId: '123',
      username: 'user@example.com',
      role: 'Voter',
      token: 'mockToken',
      refreshToken: 'mockRefreshToken'
    }));

    component.handleLogin();

    expect(component.loading).toBeFalse();
    expect(authServiceSpy.login).toHaveBeenCalledWith('user@example.com', 'Password123');
  });

  it('should show error if login fails with string message', () => {
    component.loginForm.setValue({ un: 'user@example.com', pass: 'Password123' });

    authServiceSpy.login.and.returnValue(throwError(() => ({ error: 'Invalid credentials' })));

    component.handleLogin();

    expect(component.error).toBe('Invalid credentials');
    expect(component.loading).toBeFalse();
  });

  it('should show error if login fails with object error', () => {
    component.loginForm.setValue({ un: 'user@example.com', pass: 'Password123' });

    authServiceSpy.login.and.returnValue(
      throwError(() => ({ error: { message: 'Login failed' } }))
    );

    component.handleLogin();

    expect(component.error).toBe('Login failed');
  });
});
