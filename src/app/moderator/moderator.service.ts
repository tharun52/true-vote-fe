import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { VoterEmailModel } from "../models/VoterEmailModel";

@Injectable()
export class ModeratorService { 
    private baseUrl = environment.apiBaseUrl;
    
    constructor(private http:HttpClient)
    {}
    getModeratorEmails(): Observable<VoterEmailModel[]> {
    return this.http.get<any>(`${this.baseUrl}Voter/moderator/emails`)
        .pipe(map(res => res.data?.$values || []));
    }

    addToWhitelist(emails: string[]): Observable<any> {
        return this.http.post(`${this.baseUrl}Voter/whitelist`, {
            emails
        });
    }
}