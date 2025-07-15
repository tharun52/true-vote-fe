import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VoterPolls } from './voter-polls';
import { AuthService } from '../../auth/auth.service';
import { PollService } from '../../polls/poll.service';
import { of } from 'rxjs';

describe('VoterPolls', () => {
  let component: VoterPolls;
  let fixture: ComponentFixture<VoterPolls>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let pollServiceSpy: jasmine.SpyObj<PollService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    pollServiceSpy = jasmine.createSpyObj('PollService', ['getPolls', 'getPollFileUrl']);

    authServiceSpy.getCurrentUser.and.returnValue({
      userId: 'voter123',
      username: 'voter@example.com',
      role: 'Voter',
      token: '',
      refreshToken: ''
    });

    pollServiceSpy.getPolls.and.returnValue(of({
      data: [],
      pagination: {
        totalPages: 1,
        totalRecords: 0,
        page: 1,
        pageSize: 4
      }
    }));


    pollServiceSpy.getPollFileUrl.and.returnValue('http://fake-url.com/file');

    await TestBed.configureTestingModule({
      imports: [VoterPolls], // standalone component
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: PollService, useValue: pollServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VoterPolls);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the VoterPolls component', () => {
    expect(component).toBeTruthy();
  });

  it('should set voterId from AuthService', () => {
    expect(component.voterId).toBe('voter123');
  });
});
