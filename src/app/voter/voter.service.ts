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
    
    getStats(voterId: string): Observable<any> {
        return this.http.get(`${this.baseUrl}Voter/stats/${voterId}`);
    }
    getVoterByEmail(email: string): Observable<VoterModel> {
        return this.http.get<any>(`${this.baseUrl}Voter/${email}`)
        .pipe(map(res => res.data));
    }

    updateAsAdmin(voterId: string, body: any) {
        return this.http.put(`${this.baseUrl}Voter/updateasadmin/${voterId}`, body);
    }

    updateAsVoter(body: any) {
        return this.http.put(`${this.baseUrl}Voter/update`, body);
    }

    deleteVoter(voterId:string){
        return this.http.delete(`${this.baseUrl}Voter/delete/${voterId}`);
    }
}