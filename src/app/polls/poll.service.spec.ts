import { TestBed } from '@angular/core/testing';
import { PollService } from './poll.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { PollQueryDto } from '../models/PollModels';

describe('PollService', () => {
  let service: PollService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiBaseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PollService],
    });

    service = TestBed.inject(PollService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a poll', () => {
    const mockFormData = new FormData();
    const mockResponse = { success: true };

    service.addPoll(mockFormData).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}Poll/add`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockFormData);
    req.flush(mockResponse);
  });

  it('should get polls with query params', () => {
    const query: PollQueryDto = {
      searchTerm: 'Test',
      sortBy: 'date',
      sortDesc: true,
      startDateFrom: '2024-01-01',
      startDateTo: '2024-12-31',
      createdByEmail: 'test@example.com',
      VoterId: '123',
      ForVoting: true,
      page: 2,
      pageSize: 5,
    };

    const mockResponse = {
      data: {
        data: { $values: [{ id: '1', title: 'Poll1' }] },
        pagination: {
          totalPages: 1,
          page: 2,
          pageSize: 5,
          totalRecords: 1,
        },
      },
    };

    service.getPolls(query).subscribe(res => {
      expect(res.data.length).toBe(1);
      expect(res.pagination.page).toBe(2);
    });

    const req = httpMock.expectOne(req => req.url === `${baseUrl}Poll/query`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('SearchTerm')).toBe('Test');
    expect(req.request.params.get('SortBy')).toBe('date');
    expect(req.request.params.get('SortDesc')).toBe('true');
    expect(req.request.params.get('VoterId')).toBe('123');
    expect(req.request.params.get('ForVoting')).toBe('true');
    expect(req.request.params.get('Page')).toBe('2');
    expect(req.request.params.get('PageSize')).toBe('5');
    req.flush(mockResponse);
  });

  it('should update a poll', () => {
    const mockFormData = new FormData();
    const pollId = 'poll123';
    const mockResponse = { success: true };

    service.updatePoll(pollId, mockFormData).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}Poll/update/${pollId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockFormData);
    req.flush(mockResponse);
  });

  it('should return poll file URL', () => {
    const fileId = 'file123';
    const url = service.getPollFileUrl(fileId);
    expect(url).toBe(`${baseUrl}File/${fileId}`);
  });

  it('should get file metadata', () => {
    const fileId = 'file456';
    const mockContentType = 'application/pdf';

    service.getFileMetadata(fileId).subscribe(type => {
      expect(type).toBe(mockContentType);
    });

    const req = httpMock.expectOne(`${baseUrl}File/${fileId}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');
    req.flush(new Blob(), {
      headers: { 'Content-Type': mockContentType }
    });
  });

  it('should send vote', () => {
    const pollOptionId = 'opt789';
    const mockResponse = { success: true };

    service.vote(pollOptionId).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}Vote`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ pollOptionId });
    req.flush(mockResponse);
  });
});
