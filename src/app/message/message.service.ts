import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { MessageModel } from '../models/MessageModel';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class MessageService {
  private baseUrl = environment.apiBaseUrl;

  private hubConnection: signalR.HubConnection | null = null;
  private newMessageSubject = new Subject<MessageModel>();
  private messageDeletedSubject = new Subject<string>();

  public newMessage$ = this.newMessageSubject.asObservable();
  public messageDeleted$ = this.messageDeletedSubject.asObservable();

  constructor(private http: HttpClient, private authService:AuthService) {
    this.startSignalRConnection();
  }

  addMessage(message: { msg: string; pollId?: string; to?: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}Message/add`, message);
  }

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

  private startSignalRConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.baseUrl.replace('api/v1/', '')}messageHub`, {
        accessTokenFactory: () => this.authService.getToken() || ''  // ✅ Ensure no null
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => console.log('SignalR connected to /messageHub'))
      .catch(err => console.error('SignalR connection error:', err));

    this.hubConnection.on('ReceiveMessage', (msg: MessageModel) => {
      const currentUserId = this.authService.getCurrentUser()?.userId;

      if (!currentUserId) return;

      if (!msg.to || msg.to.includes(currentUserId)) {
        this.newMessageSubject.next(msg);
      }
    });

    this.hubConnection.on('DeleteMessage', (messageId: string) => {
      this.messageDeletedSubject.next(messageId);
    });
  }

}
