import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PollsList } from './polls-list';
import { of, throwError } from 'rxjs';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PollService } from '../poll.service';
import { AuthService } from '../../auth/auth.service';

describe('PollsList', () => {
  let component: PollsList;
  let fixture: ComponentFixture<PollsList>;
  let mockPollService: any;
  let mockAuthService: any;

  beforeEach(async () => {
    mockPollService = {
      getPolls: jasmine.createSpy('getPolls').and.returnValue(of({
        data: [{ poll: { id: '1', title: 'Poll 1' }, voteTime: '2025-07-13T12:00:00Z' }],
        pagination: { totalPages: 1 }
      })),
      getPollFileUrl: jasmine.createSpy('getPollFileUrl').and.returnValue('http://file-url')
    };

    mockAuthService = {
      getRole: jasmine.createSpy('getRole').and.returnValue('moderator'),
      getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue({
        userId: '123',
        username: 'testuser',
        role: 'Moderator',
        token: 'abc.token.xyz',
        refreshToken: 'refresh-token'
      })
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, PollsList],
      providers: [
        { provide: PollService, useValue: mockPollService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PollsList);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load polls on init', () => {
    expect(mockPollService.getPolls).toHaveBeenCalled();
    expect(component.polls.length).toBe(1);
  });

  it('should set error message on poll load failure', fakeAsync(() => {
    mockPollService.getPolls.and.returnValue(throwError(() => new Error('Load error')));
    component.loadPolls();
    tick();
    expect(component.errorMessage).toBe('Failed to load polls. Please try again.');
    expect(component.loading).toBeFalse();
  }));

  it('should go to next and previous pages', () => {
    component.totalPages = 2;
    component.page = 1;

    component.nextPage();
    expect(component.page).toBe(2);

    component.previousPage();
    expect(component.page).toBe(1);
  });

  it('should return true for isModerator if role is moderator', () => {
    expect(component.isModerator).toBeTrue();
  });
});
