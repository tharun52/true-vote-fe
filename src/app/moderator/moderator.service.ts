import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { ModeratorModel, ModeratorQueryDto } from "../models/ModeratorModel";
import { ApiResponse, PagedResponse } from "../models/ResponseModes";
import { VoterEmailModel } from "../models/VoterEmailModel";

@Injectable()
export class ModeratorService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }
  getModeratorEmails(): Observable<VoterEmailModel[]> {
    return this.http.get<any>(`${this.baseUrl}Voter/moderator/emails`)
      .pipe(map(res => res.data?.$values || []));
  } 
  getStats(moderatorId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}Moderator/stats/${moderatorId}`);
  }

 
  addToWhitelist(emails: string[]): Observable<any> {
    return this.http.post(`${this.baseUrl}Voter/whitelist`, {
      emails
    });
  }
 
  deleteWhitelistedEmail(email: string) {
    return this.http.delete(`${this.baseUrl}Voter/delete/whitelist/${encodeURIComponent(email)}`);
  }
  addModerator(data: { name: string; email: string; password: string }) {
    return this.http.post(`${this.baseUrl}Moderator/add`, data);
  }


  getModeratorByEmail(email: string): Observable<ModeratorModel> {
    return this.http.get<any>(`${this.baseUrl}Moderator/email/${email}`)
      .pipe(map(res => res.data));
  }

  updateAsAdmin(moderatorId: string, body: any) {
    return this.http.put(`${this.baseUrl}Moderator/updateasadmin/${moderatorId}`, body);
  }

  updateAsModerator(body: any) {
    return this.http.put(`${this.baseUrl}Moderator/update`, body);
  }

  deleteModerator(moderatorId:string){
    return this.http.delete(`${this.baseUrl}Moderator/delete/${moderatorId}`);
  }

  getModerators(query: ModeratorQueryDto): Observable<PagedResponse<ModeratorModel>> {
    let params = new HttpParams();

    if (query.searchTerm) params = params.set('SearchTerm', query.searchTerm);
    if (query.sortBy) params = params.set('SortBy', query.sortBy);
    if (query.sortDesc !== undefined) params = params.set('SortDesc', query.sortDesc.toString());

    params = params
      .set('Page', query.page.toString())
      .set('PageSize', query.pageSize.toString())
      .set('IsDeleted', query.isDeleted.toString());

    return this.http.get<ApiResponse<any>>(`${this.baseUrl}Moderator/query`, { params }).pipe(
      map(res => {
        const data = res?.data?.data?.$values ?? [];
        const pagination = res?.data?.pagination ?? {
          totalRecords: 0,
          page: 1,
          pageSize: 10,
          totalPages: 1
        };

        return {
          data: data as ModeratorModel[],
          pagination
        };
      })
    );
  }
}