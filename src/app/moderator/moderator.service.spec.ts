import { TestBed } from '@angular/core/testing';
import { ModeratorService } from './moderator.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { VoterEmailModel } from '../models/VoterEmailModel';
import { ModeratorModel, ModeratorQueryDto } from '../models/ModeratorModel';

describe('ModeratorService', () => {
  let service: ModeratorService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiBaseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ModeratorService]
    });

    service = TestBed.inject(ModeratorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch moderator emails', () => {
    const mockResponse = { data: { $values: [{ email: 'mod@example.com' }] } };

    service.getModeratorEmails().subscribe(emails => {
      expect(emails.length).toBe(1);
      expect(emails[0].email).toBe('mod@example.com');
    });

    const req = httpMock.expectOne(`${baseUrl}Voter/moderator/emails`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch moderator stats', () => {
    const mockStats = { votes: 10 };
    service.getStats('123').subscribe(stats => {
      expect(stats.votes).toBe(10);
    });

    const req = httpMock.expectOne(`${baseUrl}Moderator/stats/123`);
    expect(req.request.method).toBe('GET');
    req.flush(mockStats);
  });

  it('should add to whitelist', () => {
    const emails = ['a@a.com'];
    service.addToWhitelist(emails).subscribe(res => {
      expect(res.success).toBeTrue();
    });

    const req = httpMock.expectOne(`${baseUrl}Voter/whitelist`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ emails });
    req.flush({ success: true });
  });

  it('should delete whitelisted email', () => {
    const email = 'test@example.com';
    service.deleteWhitelistedEmail(email).subscribe(res => {
      expect(res).toEqual({});
    });

    const req = httpMock.expectOne(`${baseUrl}Voter/delete/whitelist/${encodeURIComponent(email)}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });


  it('should get moderator by email', () => {
    const email = 'mod@example.com';
    const mockResponse = { data: { name: 'Mod', email } };

    service.getModeratorByEmail(email).subscribe(res => {
      expect(res.email).toBe(email);
    });

    const req = httpMock.expectOne(`${baseUrl}Moderator/email/${email}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  
  it('should delete a moderator', () => {
    const id = 'mod456';

    service.deleteModerator(id).subscribe(res => {
      expect(res).toEqual({});
    });

    const req = httpMock.expectOne(`${baseUrl}Moderator/delete/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should get moderators with query params', () => {
    const query: ModeratorQueryDto = {
      searchTerm: 'admin',
      sortBy: 'name',
      sortDesc: true,
      page: 1,
      pageSize: 10,
      isDeleted: false
    };

    const mockResponse = {
      data: {
        data: { $values: [{ email: 'mod@example.com' }] },
        pagination: {
          totalRecords: 1,
          page: 1,
          pageSize: 10,
          totalPages: 1
        }
      }
    };

    service.getModerators(query).subscribe(res => {
      expect(res.data.length).toBe(1);
      expect(res.pagination.totalRecords).toBe(1);
    });

    const req = httpMock.expectOne(req => 
      req.method === 'GET' &&
      req.url === `${baseUrl}Moderator/query` &&
      req.params.get('SearchTerm') === 'admin' &&
      req.params.get('SortBy') === 'name' &&
      req.params.get('SortDesc') === 'true'
    );

    req.flush(mockResponse);
  });
});
