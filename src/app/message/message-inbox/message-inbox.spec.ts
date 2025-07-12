import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageInbox } from './message-inbox';
import { MessageService } from '../message.service';
import { PollService } from '../../polls/poll.service';
import { UserService } from '../../shared/UserService';
import { AuthService } from '../../auth/auth.service';
import { of, Subject } from 'rxjs';
import { PollCard } from "../../polls/poll-card/poll-card";
import { DatePipe } from '@angular/common';
import { PollModel } from '../../models/PollModels';
import { MessageModel } from '../../models/MessageModel';

describe('MessageInbox', () => {
  let component: MessageInbox;
  let fixture: ComponentFixture<MessageInbox>;

  let messageServiceSpy: jasmine.SpyObj<MessageService>;
  let pollServiceSpy: jasmine.SpyObj<PollService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    messageServiceSpy = jasmine.createSpyObj('MessageService', [
      'getMessages',
      'deleteMessage',
      'clearAll'
    ], {
      newMessage$: new Subject<MessageModel>(),
      messageDeleted$: new Subject<string>()
    });

    pollServiceSpy = jasmine.createSpyObj('PollService', ['getPollById']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUserById']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    authServiceSpy.getCurrentUser.and.returnValue({
      userId: 'voter1',
      username: 'test user',
      role: 'Voter',
      token: '123',
      refreshToken: '456'
    });

    await TestBed.configureTestingModule({
      imports: [PollCard, DatePipe, MessageInbox],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: PollService, useValue: pollServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MessageInbox);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load messages on init', () => {
    const mockMessages: MessageModel[] = [
      { id: 'm1', msg: 'Hello', to: 'voter1', from: 'admin1', sentAt: new Date().toISOString(), pollId: 'p1' }
    ];
    const mockPoll: PollModel = {
      id: 'p1',
      title: 'Test Poll',
      description: 'Desc',
      createdByEmail: 'admin1@test.com',
      startDate: '',
      endDate: '',
      isDeleted: false,
      poleFileId: '',
      pollOptions: []
    };

    messageServiceSpy.getMessages.and.returnValue(of(mockMessages));
    pollServiceSpy.getPollById.and.returnValue(of(mockPoll));

    component.ngOnInit();
    expect(component.messages.length).toBe(1);
    expect(component.pollMap['p1']).toEqual(mockPoll);  
  });

  it('should delete a message and reload', () => {
    messageServiceSpy.deleteMessage.and.returnValue(of({}));
    spyOn(component, 'loadMessages');

    component.deleteMessage('m1');
    expect(messageServiceSpy.deleteMessage).toHaveBeenCalledWith('m1');
    expect(component.loadMessages).toHaveBeenCalled();
  });

  it('should clear all messages and reload', () => {
    messageServiceSpy.clearAll.and.returnValue(of({}));
    spyOn(component, 'loadMessages');

    component.clearAllMessages();
    expect(messageServiceSpy.clearAll).toHaveBeenCalled();
    expect(component.loadMessages).toHaveBeenCalled();
  });
});
