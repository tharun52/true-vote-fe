import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModeratorDashboard } from './moderator-dashboard';
import { AuthService } from '../../auth/auth.service';
import { ModeratorService } from '../moderator.service';
import { of, throwError } from 'rxjs';
import { ModeratorModel } from '../../models/ModeratorModel';

describe('ModeratorDashboard', () => {
  let component: ModeratorDashboard;
  let fixture: ComponentFixture<ModeratorDashboard>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let moderatorServiceSpy: jasmine.SpyObj<ModeratorService>;

  const mockModerator: ModeratorModel = {
    id: 'mod123',
    name: 'Alice Moderator',
    email: 'alice@example.com',
    isDeleted: false,
  };

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    moderatorServiceSpy = jasmine.createSpyObj('ModeratorService', ['getModeratorByEmail', 'getStats']);

    await TestBed.configureTestingModule({
      imports: [ModeratorDashboard],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ModeratorService, useValue: moderatorServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModeratorDashboard);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    authServiceSpy.getCurrentUser.and.returnValue({
      userId: '1',
      username: 'alice@example.com',
      role: 'Moderator',
      token: 'fake-token',
      refreshToken: 'fake-refresh'
    });

    moderatorServiceSpy.getModeratorByEmail.and.returnValue(of({
      id: '1',
      name: 'Alice',
      email: 'alice@example.com',
      isDeleted: false
    }));

    moderatorServiceSpy.getStats.and.returnValue(of({
      totalPollsCreated: 0,
      totalVoterEmailsCreated: 0,
      totalVoterEmailsUsed: 0,
      totalVotesReceived: 0
    }));

    const fixture = TestBed.createComponent(ModeratorDashboard);
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();
    expect(component.moderator?.email).toBe('alice@example.com');
  });

  it('should not fetch moderator if user is not a Moderator', () => {
    authServiceSpy.getCurrentUser.and.returnValue({
      userId: 'user-123',
      username: 'alice@example.com',
      role: 'Moderator',
      token: 'fake-jwt-token',
      refreshToken: 'fake-refresh-token'
    });


    fixture.detectChanges();
    expect(component.moderator).toBeNull();
  });

  it('should handle error if fetching moderator fails', () => {
    const fakeError = new Error('Failed to fetch');

    authServiceSpy.getCurrentUser.and.returnValue({
      userId: '1',
      username: 'alice@example.com',
      role: 'Moderator',
      token: 't',
      refreshToken: 'r'
    });

    const consoleSpy = spyOn(console, 'error');

    moderatorServiceSpy.getModeratorByEmail.and.returnValue(throwError(() => fakeError));

    const fixture = TestBed.createComponent(ModeratorDashboard);
    fixture.detectChanges();

    expect(consoleSpy).toHaveBeenCalledWith('Error fetching moderator info', fakeError);
  });
});
