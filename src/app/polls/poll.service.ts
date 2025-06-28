import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PollQueryDto, PollResponseItemModel } from '../models/PollModels';
import { ApiResponse, PagedResponse } from '../models/ResponseModes';

@Injectable()
export class PollService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  addPoll(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}Poll/add`, formData);
  }

  getPolls(query: PollQueryDto): Observable<PagedResponse<PollResponseItemModel>> {
    let params = new HttpParams();

    if (query.searchTerm) params = params.set('SearchTerm', query.searchTerm);
    if (query.sortBy) params = params.set('SortBy', query.sortBy);
    if (query.sortDesc !== undefined) params = params.set('SortDesc', query.sortDesc.toString());
    if (query.startDateFrom) params = params.set('StartDateFrom', query.startDateFrom);
    if (query.startDateTo) params = params.set('StartDateTo', query.startDateTo);
    if (query.createdByEmail) params = params.set('CreatedByEmail', query.createdByEmail);

    if (query.VoterId) params = params.set('VoterId', query.VoterId);          // ✅ Add this
    if (query.ForVoting !== undefined) params = params.set('ForVoting', query.ForVoting.toString()); // ✅ Add this

    params = params.set('Page', (query.page || 1).toString());
    params = params.set('PageSize', (query.pageSize || 10).toString());

    return this.http
      .get<any>(`${this.baseUrl}Poll/query`, { params })
      .pipe(
        map(res => {
          return {
            data: res?.data?.data?.$values ?? [],
            pagination: res?.data?.pagination ?? {
              totalPages: 0,
              page: 1,
              pageSize: 10,
              totalRecords: 0
            }
          };
        })
      );
  }

  updatePoll(pollId: string, formData: FormData) {
    return this.http.put(`${this.baseUrl}Poll/update/${pollId}`, formData);
  }


  getPollFileUrl(fileId: string): string {
    return `${this.baseUrl}File/${fileId}`;
  }

  getFileMetadata(fileId: string): Observable<string> {
    return this.http
      .get(`${this.baseUrl}File/${fileId}`, {
        observe: 'response',
        responseType: 'blob' as 'json'
      })
      .pipe(
        map(response => response.headers.get('Content-Type') || '')
      );
  }
}