import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MessageModel } from '../models/MessageModel';
import { environment } from '../../environments/environment';

@Injectable()
export class MessageService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getMessages(): Observable<MessageModel[]> {
    return this.http.get<any>(`${this.baseUrl}Message/inbox`).pipe(
      map(res => res.data?.$values || [])
    );
  }

  deleteMessage(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}Message/clear/${id}`);
  }

  clearAll(): Observable<any> {
    return this.http.delete(`${this.baseUrl}Message/clear-all`);
  }
  getCreatedMessages(): Observable<MessageModel[]> {
    return this.http.get<any>(`${this.baseUrl}Message/sent`).pipe(
      map(res => res.data?.$values || [])
    );
  }

  deleteCreatedMessage(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}Message/delete/${id}`);
  }
}
