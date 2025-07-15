import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AdimHome } from './adim-home';
import { AuthService } from '../../auth/auth.service';
import { AdminService } from '../admin.service';
import { of, throwError } from 'rxjs';
import { UserModel } from '../../models/UserModel'; // Adjust path if needed

describe('AdimHome Component', () => {
  let component: AdimHome;
  let fixture: ComponentFixture<AdimHome>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let adminServiceSpy: jasmine.SpyObj<AdminService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    adminServiceSpy = jasmine.createSpyObj('AdminService', ['getAdmin', 'getStats']);

    await TestBed.configureTestingModule({
      imports: [AdimHome],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: AdminService, useValue: adminServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdimHome);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('when logged-in user is Admin', () => {
    const mockUser: UserModel = new UserModel(
      '123',
      'admin_user',
      'Admin',
      'fake-token',
      'fake-refresh'
    );

    const mockAdminData = {
      id: '123',
      name: 'Admin Name',
      email: 'admin@example.com', 
      isDeleted : false
    };

    beforeEach(() => {
      authServiceSpy.getCurrentUser.and.returnValue(mockUser);
    });

    it('should handle admin fetch failure', fakeAsync(() => {
      adminServiceSpy.getAdmin.and.returnValue(throwError(() => new Error('API fail')));

      fixture.detectChanges();

      expect(component.isLoadingAdmin).toBeFalse();
      expect(component.admin).toBeNull();
    }));

    it('should handle stats fetch failure', fakeAsync(() => {
      adminServiceSpy.getAdmin.and.returnValue(of(mockAdminData));
      adminServiceSpy.getStats.and.returnValue(throwError(() => new Error('Stat error')));

      fixture.detectChanges();
      tick();

      expect(component.isLoadingStats).toBeFalse();
      expect(component.stats).toBeUndefined();
    }));
  });

  describe('when user is not Admin', () => {
    const mockNonAdminUser: UserModel = new UserModel(
      '124',
      'voter_user',
      'Voter',
      'token',
      'refreshToken'
    );

    it('should set loading false and not fetch admin', () => {
      authServiceSpy.getCurrentUser.and.returnValue(mockNonAdminUser);

      fixture.detectChanges();

      expect(component.isLoadingAdmin).toBeFalse();
      expect(component.admin).toBeNull();
      expect(adminServiceSpy.getAdmin).not.toHaveBeenCalled();
    });
  });
});
