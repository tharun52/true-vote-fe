import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageCreated } from './message-created';
import { MessageService } from '../message.service';
import { UserService } from '../../shared/UserService';
import { ToastService } from '../../shared/ToastService';
import { AuthService } from '../../auth/auth.service';
import { PollService } from '../../polls/poll.service';
import { of, Subject } from 'rxjs';
import { MessageModel } from '../../models/MessageModel';
import { PollModel } from '../../models/PollModels';

describe('MessageCreated', () => {
  let component: MessageCreated;
  let fixture: ComponentFixture<MessageCreated>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;
  let pollServiceSpy: jasmine.SpyObj<PollService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockMessages: MessageModel[] = [
    {
      id: 'msg1',
      msg: 'Hello!',
      to: 'user1',
      from: 'admin1',
      pollId: 'poll1',
      sentAt: new Date().toISOString()
    }
  ];

  const mockPoll: PollModel = {
    id: 'poll1',
    title: 'Sample Poll',
    description: 'Test poll description',
    createdByEmail: 'admin1@example.com',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-12-31T23:59:59Z',
    isDeleted: false,
    poleFileId: '',
    pollOptions: []
  };


  beforeEach(async () => {
    messageServiceSpy = jasmine.createSpyObj('MessageService', [
      'getCreatedMessages',
      'deleteCreatedMessage'
    ], {
      newMessage$: new Subject<MessageModel>(),
      messageDeleted$: new Subject<string>()
    });

    userServiceSpy = jasmine.createSpyObj('UserService', ['getUserById']);
    pollServiceSpy = jasmine.createSpyObj('PollService', ['getPollById']);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);

    await TestBed.configureTestingModule({
      imports: [MessageCreated],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: PollService, useValue: pollServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MessageCreated);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch created messages on init', () => {
    messageServiceSpy.getCreatedMessages.and.returnValue(of(mockMessages));
    pollServiceSpy.getPollById.and.returnValue(of(mockPoll));

    component.ngOnInit();

    expect(messageServiceSpy.getCreatedMessages).toHaveBeenCalled();
    expect(pollServiceSpy.getPollById).toHaveBeenCalledWith('poll1');
    expect(component.messages.length).toBe(1);
    expect(component.pollMap['poll1']).toEqual(mockPoll);
  });

  it('should delete a message after confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    messageServiceSpy.deleteCreatedMessage.and.returnValue(of({}));

    component.deleteMessage('msg1');

    expect(messageServiceSpy.deleteCreatedMessage).toHaveBeenCalledWith('msg1');
    expect(toastServiceSpy.show).toHaveBeenCalledWith(
      'Message Deleted',
      'This message has been deleted successfully and it is no longer visible to voters',
      true
    );
  });

  
  it('should open and close poll modal correctly', () => {
    component.pollMap['poll1'] = mockPoll;
    component.openPollModal('poll1');
    expect(component.selectedPoll).toEqual(mockPoll);

    component.closePollModal();
    expect(component.selectedPoll).toBeNull();
  });
});
