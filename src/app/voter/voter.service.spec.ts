import { TestBed } from '@angular/core/testing';
import { VoterService } from './voter.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { VoterModel } from '../models/VoterModel';

describe('VoterService', () => {
  let service: VoterService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiBaseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VoterService]
    });

    service = TestBed.inject(VoterService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests
  });

  it('should fetch voter stats by ID', () => {
    const voterId = '123';
    const mockStats = { totalVotes: 5 };

    service.getStats(voterId).subscribe(res => {
      expect(res).toEqual(mockStats);
    });

    const req = httpMock.expectOne(`${baseUrl}Voter/stats/${voterId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockStats);
  });

  it('should fetch voter by email and map data', () => {
    const email = 'test@example.com';
    const mockResponse = { data: { id: '1', name: 'Test Voter' } };

    service.getVoterByEmail(email).subscribe(voter => {
      expect(voter).toEqual(mockResponse.data as VoterModel);
    });

    const req = httpMock.expectOne(`${baseUrl}Voter/${email}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should update voter as admin', () => {
    const voterId = '1';
    const updateBody = { name: 'Updated' };

    service.updateAsAdmin(voterId, updateBody).subscribe(res => {
      expect(res).toEqual({ success: true });
    });

    const req = httpMock.expectOne(`${baseUrl}Voter/updateasadmin/${voterId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateBody);
    req.flush({ success: true });
  });

  it('should update voter as voter', () => {
    const updateBody = { name: 'Self Updated' };

    service.updateAsVoter(updateBody).subscribe(res => {
      expect(res).toEqual({ success: true });
    });

    const req = httpMock.expectOne(`${baseUrl}Voter/update`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateBody);
    req.flush({ success: true });
  });

  it('should delete a voter by ID', () => {
    const voterId = '2';

    service.deleteVoter(voterId).subscribe(res => {
      expect(res).toEqual({ deleted: true });
    });

    const req = httpMock.expectOne(`${baseUrl}Voter/delete/${voterId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ deleted: true });
  });
});
