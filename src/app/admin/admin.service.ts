import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpParams} from "@angular/common/http";
import { Observable, map } from "rxjs";
import { ModeratorModel, ModeratorQueryDto } from "../models/ModeratorModel";

@Injectable()
export class AdminService {
private baseUrl = environment.apiBaseUrl;

constructor(private http: HttpClient) { }
    getStats(): Observable<any> {
        return this.http.get(`${this.baseUrl}Admin/stats`);
    }

    getAdmin(adminId: string): Observable<ModeratorModel> {
        return this.http.get<any>(`${this.baseUrl}Admin/${adminId}`)
        .pipe(map(res => res.data));
    }

    getAuditLogs(page = 1, pageSize = 20): Observable<any> {
        const params = new HttpParams()
            .set('page', page)
            .set('pageSize', pageSize);

        return this.http.get(`${this.baseUrl}Admin/AuditLogs`, { params });
    }

}