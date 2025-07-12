import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddMessage } from './add-message';
import { MessageService } from '../message.service';
import { PollService } from '../../polls/poll.service';
import { VoterService } from '../../voter/voter.service';
import { AuthService } from '../../auth/auth.service';
import { ModeratorService } from '../../moderator/moderator.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('AddMessage', () => {
  let component: AddMessage;
  let fixture: ComponentFixture<AddMessage>;

  const mockAuthService = {
    getRole: () => 'Moderator'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMessage],
      providers: [
        provideHttpClientTesting(),
        { provide: MessageService, useValue: { addMessage: () => of({}) } },
        { provide: PollService, useValue: { getPolls: () => of({ data: [], pagination: { totalPages: 1 } }) } },
        { provide: VoterService, useValue: { getAllVoters: () => of([]) } },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ModeratorService, useValue: { getModerators: () => of({ data: [] }) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddMessage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send message when form is valid', () => {
    const messageService = TestBed.inject(MessageService);
    spyOn(messageService, 'addMessage').and.returnValue(of({}));

    component.messageForm.setValue({
      msg: 'Hello',
      pollId: '',
      to: 'voter123'
    });

    component.selectedVoter = {
      id: 'voter123',
      name: 'Test Voter',
      email: 'voter@example.com',
      age: 25,
      isDeleted: false,
      moderatorId: 'mod456'
    };

    component.sendMessage();

    expect(messageService.addMessage).toHaveBeenCalledWith({
      msg: 'Hello',
      to: 'voter123'
    });
    expect(component.success).toBeTrue();
  });


  it('should not send message if form is invalid', () => {
    const messageService = TestBed.inject(MessageService);
    spyOn(messageService, 'addMessage');

    // Invalidate the form (missing msg and to)
    component.messageForm.setValue({
      msg: '',
      pollId: '',
      to: ''
    });

    component.sendMessage();

    expect(component.messageForm.invalid).toBeTrue();
    expect(messageService.addMessage).not.toHaveBeenCalled();
    expect(component.success).toBeFalse();
    expect(component.loading).toBeFalse();
  });
});
