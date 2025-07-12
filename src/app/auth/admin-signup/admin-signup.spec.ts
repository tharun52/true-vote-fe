import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminSignup } from './admin-signup';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { provideHttpClient, HttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('AdminSignup', () => {
  let component: AdminSignup;
  let fixture: ComponentFixture<AdminSignup>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['registerAdmin', 'login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [AdminSignup, ReactiveFormsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminSignup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit if form is invalid', () => {
    component.AdminSignUpForm.setValue({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      seceretAdminKey: ''
    });

    component.handleAdminSignup();

    expect(authServiceSpy.registerAdmin).not.toHaveBeenCalled();
    expect(component.error).toBe('');
  });

  it('should register admin and auto-login on valid form', () => {
    const mockForm = {
      name: 'Admin',
      email: 'admin@example.com',
      password: 'Test1234',
      confirmPassword: 'Test1234',
      seceretAdminKey: 'secret'
    };

    component.AdminSignUpForm.setValue(mockForm);

    authServiceSpy.registerAdmin.and.returnValue(of({}));
    authServiceSpy.login.and.returnValue(of({
      userId: '1',
      username: 'admin@example.com',
      role: 'Admin',
      token: 'mockToken',
      refreshToken: 'mockRefreshToken'
    }));


    component.handleAdminSignup();

    expect(authServiceSpy.registerAdmin).toHaveBeenCalledWith({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'Test1234',
      seceretAdminKey: 'secret'
    });

    expect(authServiceSpy.login).toHaveBeenCalledWith('admin@example.com', 'Test1234');
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('admin');
  });

  it('should show error if registerAdmin fails', () => {
    const mockForm = {
      name: 'Admin',
      email: 'admin@example.com',
      password: 'Test1234',
      confirmPassword: 'Test1234',
      seceretAdminKey: 'secret'
    };

    component.AdminSignUpForm.setValue(mockForm);

    const errorMsg = 'You are not authorized';
    authServiceSpy.registerAdmin.and.returnValue(throwError(() => errorMsg));

    component.handleAdminSignup();

    expect(component.error).toBe(errorMsg);
  });

  it('should show auto-login error if login fails', () => {
    const mockForm = {
      name: 'Admin',
      email: 'admin@example.com',
      password: 'Test1234',
      confirmPassword: 'Test1234',
      seceretAdminKey: 'secret'
    };

    component.AdminSignUpForm.setValue(mockForm);

    authServiceSpy.registerAdmin.and.returnValue(of({}));
    authServiceSpy.login.and.returnValue(throwError(() => 'Login failed'));

    component.handleAdminSignup();

    expect(component.error).toBe('Auto-login failed.');
  });
});
