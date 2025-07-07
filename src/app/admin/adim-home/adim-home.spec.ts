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
      declarations: [AdimHome],
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

    it('should load admin info and then fetch stats', fakeAsync(() => {
      adminServiceSpy.getAdmin.and.returnValue(of(mockAdminData));
      adminServiceSpy.getStats.and.returnValue(of({
        totalPollsCreated: 10,
        totalVotesVoted: 20,
        totalModeratorRegistered: 5,
        totalVotersREgistered: 100
      }));

      fixture.detectChanges(); // triggers constructor

      expect(component.isLoadingAdmin).toBeFalse();
      expect(component.admin).toEqual(mockAdminData);

      tick(); // resolve getStats
      expect(component.stats.totalPollsCreated).toBeGreaterThanOrEqual(0);
      expect(component.isLoadingStats).toBeFalse();
    }));

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

  it('should animate stat count correctly', fakeAsync(() => {
    component.stats = {
      totalPollsCreated: 0,
      totalVotesVoted: 0,
      totalModeratorRegistered: 0,
      totalVotersRegistered: 0
    };

    component.animateCount('totalPollsCreated', 50);
    tick(800); // duration of animation
    expect(component.stats.totalPollsCreated).toBe(50);
  }));
});
