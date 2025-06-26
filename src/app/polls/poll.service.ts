import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PollApiResponse, PollQueryDto, PollResponseItemModel } from '../models/PollModels';

@Injectable()
export class PollService {
  private baseUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient) { }

  getPolls(query: PollQueryDto): Observable<PollResponseItemModel[]> {
    let params = new HttpParams();
    
    if (query.searchTerm) 
      params = params.set('SearchTerm', query.searchTerm);
    
    if (query.sortBy) 
      params = params.set('SortBy', query.sortBy);
    
    if (query.sortDesc !== undefined) 
      params = params.set('SortDesc', query.sortDesc.toString());
    
    if (query.startDateFrom) 
      params = params.set('StartDateFrom', query.startDateFrom);
    
    if (query.startDateTo) 
      params = params.set('StartDateTo', query.startDateTo);
    
    if(query.createdByEmail)
      params = params.set('CreatedByEmail', query.createdByEmail);

    params = params.set('Page', (query.page || 1).toString());
    params = params.set('PageSize', (query.pageSize || 10).toString());

    return this.http.get<any>(`${this.baseUrl}Poll/query`, { params }).pipe(
      map(res => res?.data?.data?.$values ?? [])
    );
  }


  getPollFileUrl(fileId: string): string {
    return `${this.baseUrl}/File/${fileId}`;
  }
}