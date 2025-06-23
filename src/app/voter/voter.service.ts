import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from "../../environments/environment";
import { VoterModel } from "../models/VoterModel";

@Injectable()
export class VoterService { 
    private baseUrl = environment.apiBaseUrl;
    
    constructor(private http:HttpClient)
    {}
    
    getVoterByEmail(email: string): Observable<VoterModel> {
        return this.http.get<any>(`${this.baseUrl}Voter/${email}`)
        .pipe(map(res => res.data));
    }
}