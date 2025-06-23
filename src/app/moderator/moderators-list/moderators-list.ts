import { Component } from '@angular/core';
import { ModeratorModel } from '../../models/ModeratorModel';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Subject, debounceTime } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-moderators-list',
  imports: [FormsModule, NgClass],
  templateUrl: './moderators-list.html',
  styleUrl: './moderators-list.css'
})
export class ModeratorsList {
  moderators: ModeratorModel[] = [];
  error: string | null = null;

  searchTerm: string = '';
  sortBy: string = '';
  sortDesc: boolean = false;
  page: number = 1;
  pageSize: number = 1;
  totalPages: number = 1; 

  private searchSubject = new Subject<void>();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.searchSubject.pipe(debounceTime(400)).subscribe(() => {
      this.page = 1;
      this.fetchModerators();
    });

    this.fetchModerators();
  }

  onSearchChange() {
    this.searchSubject.next();
  }

  toggleSortDirection() {
    this.sortDesc = !this.sortDesc;
    this.fetchModerators();
  }

  fetchModerators() {
    const params = new HttpParams()
      .set('SearchTerm', this.searchTerm)
      .set('SortBy', this.sortBy)
      .set('SortDesc', this.sortDesc)
      .set('Page', this.page)
      .set('PageSize', this.pageSize)
      .set('IsDeleted', 'false');

    this.http.get<any>(`${environment.apiBaseUrl}Moderator/query`, { params }).subscribe({
      next: (response) => {
        const rawList = response?.data?.data?.$values || [];
        this.moderators = rawList;
        this.totalPages = response?.data?.pagination?.totalPages || 1;
        this.error = null;
      },
      error: () => {
        this.error = 'Failed to load moderators.';
        this.moderators = [];
      },
    });
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.fetchModerators();
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.fetchModerators();
    }
  }

  trackByFn(index: number, item: ModeratorModel) {
    return item.Id;
  }
}