import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MessageService } from './message.service';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';
import { MessageModel } from '../models/MessageModel';

describe('MessageService', () => {
  let service: MessageService;
  let httpMock: HttpTestingController;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getToken', 'getCurrentUser']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MessageService,
        { provide: AuthService, useValue: authSpy }
      ]
    });

    service = TestBed.inject(MessageService);
    httpMock = TestBed.inject(HttpTestingController);
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a message', () => {
    const testMessage = { msg: 'Hello', pollId: '1' };

    service.addMessage(testMessage).subscribe(response => {
      expect(response).toEqual({ success: true });
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}Message/add`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(testMessage);
    req.flush({ success: true });
  });

  it('should get inbox messages', () => {
    const mockMessages = [{ id: '1', msg: 'Hi' }] as MessageModel[];

    service.getMessages().subscribe(messages => {
      expect(messages.length).toBe(1);
      expect(messages[0].msg).toBe('Hi');
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}Message/inbox`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: { $values: mockMessages } });
  });

  it('should delete a message', () => {
    const id = '123';

    service.deleteMessage(id).subscribe(response => {
      expect(response).toEqual({ deleted: true });
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}Message/clear/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ deleted: true });
  });

  it('should clear all messages', () => {
    service.clearAll().subscribe(response => {
      expect(response).toEqual({ cleared: true });
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}Message/clear-all`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ cleared: true });
  });

  it('should get sent messages', () => {
    const mockSent = [{ id: '1', msg: 'Sent msg' }] as MessageModel[];

    service.getCreatedMessages().subscribe(messages => {
      expect(messages.length).toBe(1);
      expect(messages[0].msg).toBe('Sent msg');
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}Message/sent`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: { $values: mockSent } });
  });

  it('should delete a created message', () => {
    const id = '456';

    service.deleteCreatedMessage(id).subscribe(response => {
      expect(response).toEqual({ deleted: true });
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}Message/delete/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ deleted: true });
  });
});
