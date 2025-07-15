import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { UserService } from './UserService';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockUserId = '123';
  const mockResponse = {
    id: '123',
    name: 'John Doe',
    email: 'john@example.com'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });


  it('should fetch user by ID', () => {
    service.getUserById(mockUserId).subscribe(user => {
      expect(user).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}User/${mockUserId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
