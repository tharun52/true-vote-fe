import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient} from "@angular/common/http";
import { Observable, map } from "rxjs";
import { ModeratorModel, ModeratorQueryDto } from "../models/ModeratorModel";

@Injectable()
export class AdminService {
private baseUrl = environment.apiBaseUrl;

constructor(private http: HttpClient) { }

getStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}Admin/stats`);
}

getAdmmin(adminId: string): Observable<ModeratorModel> {
    return this.http.get<any>(`${this.baseUrl}Admin/${adminId}`)
    .pipe(map(res => res.data));
}
}