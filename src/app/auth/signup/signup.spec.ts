import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Signup } from './signup';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from '../auth.service';
import { ToastService } from '../../shared/ToastService';
import { of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { VoterService } from '../../voter/voter.service';
import { ActivatedRoute } from '@angular/router';

describe('Signup', () => {
  let component: Signup;
  let fixture: ComponentFixture<Signup>;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let voterServiceSpy: jasmine.SpyObj<VoterService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
    voterServiceSpy = jasmine.createSpyObj('ToastService', ['getAllVoters', 'getStats', 'getVoterByEmail', 'updateAsAdmin', 'updateAsVoter', 'deleteVoter']);
    await TestBed.configureTestingModule({
      imports: [Signup, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: {} }, 
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: VoterService, useValue: voterServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Signup);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit form if invalid', () => {
    component.signupForm.setValue({
      name: '',
      email: '',
      age: null,
      password: '',
      confirmPassword: ''
    });
    component.handleSignup();
    expect(component.loading).toBeFalse();
  });

  it('should submit form and login successfully', () => {
    const formValue = {
      name: 'Test User',
      email: 'test@example.com',
      age: 20,
      password: 'Test1234',
      confirmPassword: 'Test1234'
    };

    const mockUser = {
      userId: '1',
      username: 'test@example.com',
      role: 'Voter',
      token: 'mockToken',
      refreshToken: 'mockRefreshToken'
    };

    component.signupForm.setValue(formValue);
    authServiceSpy.login.and.returnValue(of(mockUser));

    component.handleSignup();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}Voter/add`);
    expect(req.request.method).toBe('POST');
    req.flush({});

    expect(authServiceSpy.login).toHaveBeenCalledWith('test@example.com', 'Test1234');
    expect(component.loading).toBeFalse();
  });

  it('should handle signup error', () => {
    component.signupForm.setValue({
      name: 'User',
      email: 'user@example.com',
      age: 25,
      password: 'Test1234',
      confirmPassword: 'Test1234'
    });

    component.handleSignup();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}Voter/add`);
    req.flush({ message: 'Signup failed' }, { status: 400, statusText: 'Bad Request' });

    expect(component.error).toBe('Signup failed');
    expect(component.loading).toBeFalse();
  });

  it('should handle auto-login error', () => {
    component.signupForm.setValue({
      name: 'User',
      email: 'user@example.com',
      age: 25,
      password: 'Test1234',
      confirmPassword: 'Test1234'
    });

    authServiceSpy.login.and.returnValue(throwError(() => 'Login failed'));

    component.handleSignup();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}Voter/add`);
    req.flush({});

    expect(component.error).toBe('Auto-login failed.');
    expect(component.loading).toBeFalse();
  });
});
