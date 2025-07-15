import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VoterDetail } from './voter-detail';
import { VoterService } from '../voter.service';
import { AuthService } from '../../auth/auth.service';
import { of } from 'rxjs';
import { VoterModel } from '../../models/VoterModel';

describe('VoterDetail', () => {
  let component: VoterDetail;
  let fixture: ComponentFixture<VoterDetail>;
  let voterServiceSpy: jasmine.SpyObj<VoterService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockVoter: VoterModel = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    isDeleted: false,
    moderatorId: 'moderatorId'
  };

  beforeEach(async () => {
    const voterSpy = jasmine.createSpyObj('VoterService', ['getVoterByEmail']);
    const authSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);

    await TestBed.configureTestingModule({
      imports: [VoterDetail],
      providers: [
        { provide: VoterService, useValue: voterSpy },
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VoterDetail);
    component = fixture.componentInstance;

    voterServiceSpy = TestBed.inject(VoterService) as jasmine.SpyObj<VoterService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    authServiceSpy.getCurrentUser.and.returnValue({
      userId: 'u1',
      username: 'testuser',
      role: 'Voter',
      token: 'dummy-token',
      refreshToken: 'dummy-refresh-token'
    });
    voterServiceSpy.getVoterByEmail.and.returnValue(of(mockVoter));

    component.email = 'john@example.com';
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch voter details on init', () => {
    expect(component.voter).toEqual(mockVoter);
    expect(component.voterId).toBe('1');
    expect(component.isVoter).toBeTrue();
  });
});
